"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface SupabaseSessionContextValue {
  user: User | null
  ready: boolean
}

const SupabaseSessionContext = createContext<SupabaseSessionContextValue>({ user: null, ready: false })

export function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    let subscription: { unsubscribe: () => void } | undefined

    const bootstrap = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()

        if (data.user) {
          if (mounted) setUser(data.user)
        } else {
          const { data: anonymous } = await supabase.auth.signInAnonymously()
          if (mounted) setUser(anonymous.user ?? null)
        }

        const authState = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return
          setUser(session?.user ?? null)
        })
        subscription = authState.data.subscription
      } catch {
        // Supabase is an enhancement to anonymous browsing; never block the app shell.
      } finally {
        if (mounted) setReady(true)
      }
    }

    void bootstrap()

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ user, ready }), [user, ready])

  return <SupabaseSessionContext.Provider value={value}>{children}</SupabaseSessionContext.Provider>
}

export function useSupabaseSession() {
  return useContext(SupabaseSessionContext)
}
