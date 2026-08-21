"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface SupabaseSessionContextValue {
  user: User | null
  ready: boolean
}

const SupabaseSessionContext = createContext<SupabaseSessionContextValue>({
  user: null,
  ready: false,
})

export function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    const bootstrap = async () => {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        if (mounted) {
          setUser(data.user)
          setReady(true)
        }
        return
      }

      const { data: anonymous, error } = await supabase.auth.signInAnonymously()
      if (mounted) {
        if (!error) setUser(anonymous.user)
        setReady(true)
      }
    }

    void bootstrap()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      setReady(true)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ user, ready }), [user, ready])

  return <SupabaseSessionContext.Provider value={value}>{children}</SupabaseSessionContext.Provider>
}

export function useSupabaseSession() {
  return useContext(SupabaseSessionContext)
}
