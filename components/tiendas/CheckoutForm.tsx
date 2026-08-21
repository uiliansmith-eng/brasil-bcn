'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/lib/cart-context'
import { createOrderAction } from '@/actions/orders'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations/orders'
import { cn } from '@/lib/utils'

interface CheckoutFormProps {
  companyId: string
  storeSlug: string
  hasDelivery: boolean
}

export function CheckoutForm({ companyId, storeSlug, hasDelivery }: CheckoutFormProps) {
  const router = useRouter()
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart(companyId)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fulfillment_method: 'pickup' },
  })

  const fulfillmentMethod = watch('fulfillment_method')

  const onSubmit = async (data: CheckoutInput) => {
    setServerError(null)
    const lines = items.map((i) => ({ store_item_id: i.storeItemId, quantity: i.quantity }))
    const result = await createOrderAction(companyId, lines, data)
    if ('error' in result) { setServerError(result.error); return }
    clearCart()
    router.push(`/tiendas/${storeSlug}/pedido/${result.orderId}`)
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="font-semibold text-gray-900 mb-1">Tu carrito está vacío</p>
        <p className="text-gray-400 text-sm">Añade productos desde la tienda para continuar.</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-4">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-black text-gray-900 text-lg mb-4">Tus datos</h2>
          <div className="space-y-4">
            <FormField label="Nombre *" placeholder="Tu nombre" error={errors.customer_name?.message} {...register('customer_name')} />
            <FormField label="Teléfono *" type="tel" placeholder="+34 600 000 000" error={errors.customer_phone?.message} {...register('customer_phone')} />
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Notas (opcional)</Label>
              <Textarea rows={2} className="rounded-xl border-gray-200 resize-none" {...register('customer_notes')} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-black text-gray-900 text-lg mb-4">Entrega</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue('fulfillment_method', 'pickup')}
              className={cn(
                'flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border transition-all',
                fulfillmentMethod === 'pickup' ? 'bg-[#002776] text-white border-[#002776]' : 'bg-white text-gray-600 border-gray-200'
              )}
            >
              Recoger en tienda
            </button>
            {hasDelivery && (
              <button
                type="button"
                onClick={() => setValue('fulfillment_method', 'delivery')}
                className={cn(
                  'flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border transition-all',
                  fulfillmentMethod === 'delivery' ? 'bg-[#002776] text-white border-[#002776]' : 'bg-white text-gray-600 border-gray-200'
                )}
              >
                Entrega a domicilio
              </button>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-black text-gray-900 text-lg mb-4">Cupón</h2>
          <FormField label="Código (opcional)" placeholder="Ej: BIENVENIDO10" {...register('coupon_code')} />
        </section>
      </form>

      <aside className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
          <h3 className="font-black text-gray-900 mb-4">Tu pedido</h3>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.storeItemId} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.price.toLocaleString('es-ES')}€ c/u</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => updateQuantity(item.storeItemId, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.storeItemId, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => removeItem(item.storeItemId)} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-50 pt-4 flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="font-black text-gray-900 text-lg">{subtotal.toLocaleString('es-ES')}€</span>
          </div>
          <Button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold rounded-xl"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar pedido'}
          </Button>
          <p className="text-xs text-gray-400 text-center mt-3">El pago se coordina directamente con la tienda.</p>
        </div>
      </aside>
    </div>
  )
}
