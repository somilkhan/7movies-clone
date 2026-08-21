"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/stores/useAppStore"
import { SupabaseMediaSync } from "./SupabaseMediaSync"

interface SupabaseSessionContextValue {
  user: User | null
  ready: boolean
}

const SupabaseSessionContext = createContext<SupabaseSessionContextValue>({ user: null, ready: false })

export function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const setCloudUserId = useAppStore((state) => state.setCloudUserId)

  useEffect(() => {
    let mounted = true
    let subscription: { unsubscribe: () => void } | undefined

    const bootstrap = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        let nextUser = data.user

        if (!nextUser) {
          const { data: anonymous } = await supabase.auth.signInAnonymously()
          nextUser = anonymous.user ?? null
        }

        if (mounted) {
          setUser(nextUser)
          setCloudUserId(nextUser?.id ?? null)
        }

        const authState = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return
          const next = session?.user ?? null
          setUser(next)
          setCloudUserId(next?.id ?? null)
        })
        subscription = authState.data.subscription
      } catch {
        if (mounted) {
          setUser(null)
          setCloudUserId(null)
        }
      } finally {
        if (mounted) setReady(true)
      }
    }

    void bootstrap()

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [setCloudUserId])

  const value = useMemo(() => ({ user, ready }), [user, ready])

  return (
    <SupabaseSessionContext.Provider value={value}>
      {children}
      <SupabaseMediaSync />
    </SupabaseSessionContext.Provider>
  )
}

export function useSupabaseSession() {
  return useContext(SupabaseSessionContext)
}
