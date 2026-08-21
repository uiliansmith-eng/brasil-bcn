'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

export interface CartItem {
  storeItemId: string
  name: string
  price: number
  imageUrl: string | null
  quantity: number
}

type CartsByCompany = Record<string, CartItem[]>

const STORAGE_KEY = 'bcn_carts'

interface CartContextValue {
  carts: CartsByCompany
  addItem: (companyId: string, item: Omit<CartItem, 'quantity'>) => void
  removeItem: (companyId: string, storeItemId: string) => void
  updateQuantity: (companyId: string, storeItemId: string, quantity: number) => void
  clearCart: (companyId: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [carts, setCarts] = useState<CartsByCompany>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCarts(JSON.parse(raw))
    } catch {
      // localStorage no disponible o datos corruptos: empezamos con carrito vacío
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carts))
  }, [carts, hydrated])

  const addItem = useCallback((companyId: string, item: Omit<CartItem, 'quantity'>) => {
    setCarts((prev) => {
      const existing = prev[companyId] ?? []
      const found = existing.find((i) => i.storeItemId === item.storeItemId)
      const updated = found
        ? existing.map((i) => i.storeItemId === item.storeItemId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...existing, { ...item, quantity: 1 }]
      return { ...prev, [companyId]: updated }
    })
  }, [])

  const removeItem = useCallback((companyId: string, storeItemId: string) => {
    setCarts((prev) => ({
      ...prev,
      [companyId]: (prev[companyId] ?? []).filter((i) => i.storeItemId !== storeItemId),
    }))
  }, [])

  const updateQuantity = useCallback((companyId: string, storeItemId: string, quantity: number) => {
    setCarts((prev) => ({
      ...prev,
      [companyId]: (prev[companyId] ?? [])
        .map((i) => i.storeItemId === storeItemId ? { ...i, quantity } : i)
        .filter((i) => i.quantity > 0),
    }))
  }, [])

  const clearCart = useCallback((companyId: string) => {
    setCarts((prev) => ({ ...prev, [companyId]: [] }))
  }, [])

  const value = useMemo(() => ({ carts, addItem, removeItem, updateQuantity, clearCart }), [carts, addItem, removeItem, updateQuantity, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(companyId: string) {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')

  const items = ctx.carts[companyId] ?? []
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return {
    items,
    subtotal,
    count,
    addItem: (item: Omit<CartItem, 'quantity'>) => ctx.addItem(companyId, item),
    removeItem: (storeItemId: string) => ctx.removeItem(companyId, storeItemId),
    updateQuantity: (storeItemId: string, quantity: number) => ctx.updateQuantity(companyId, storeItemId, quantity),
    clearCart: () => ctx.clearCart(companyId),
  }
}
