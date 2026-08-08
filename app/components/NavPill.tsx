"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Search, CircleUserRound } from "lucide-react"

const TABS = ["Home", "Movies", "TV"] as const
export type Tab = (typeof TABS)[number]

const ACTIONS = [
  { key: "search", label: "Search", Icon: Search, size: 18 },
  { key: "profile", label: "Profile", Icon: CircleUserRound, size: 20 },
] as const

export function NavPill({
  value,
  onChange,
  onSearchClick,
  onAccountClick,
}: {
  value?: Tab
  onChange?: (tab: Tab) => void
  onSearchClick?: () => void
  onAccountClick?: () => void
}) {
  const [internal, setInternal] = useState<Tab>("Home")
  const active = value ?? internal
  const setActive = (tab: Tab) => {
    setInternal(tab)
    onChange?.(tab)
  }

  // Sliding indicator behind the active tab.
  const tabsRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false })

  const measure = useCallback(() => {
    const container = tabsRef.current
    const el = btnRefs.current[active]
    if (!container || !el) return
    const c = container.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    setIndicator({ left: r.left - c.left, width: r.width, ready: true })
  }, [active])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const onResize = () => measure()
    window.addEventListener("resize", onResize)
    // Re-measure once fonts settle to avoid a misaligned pill.
    document.fonts?.ready.then(measure).catch(() => {})
    return () => window.removeEventListener("resize", onResize)
  }, [measure])

  // Hover highlight that follows the action buttons.
  const actionsRef = useRef<HTMLDivElement>(null)
  const actionRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [hover, setHover] = useState({ left: 0, width: 34, opacity: 0 })

  const moveHover = useCallback((key: string | null) => {
    const container = actionsRef.current
    if (!container) return
    if (!key) {
      setHover((h) => ({ ...h, opacity: 0 }))
      return
    }
    const el = actionRefs.current[key]
    if (!el) return
    const c = container.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    setHover({ left: r.left - c.left, width: r.width, opacity: 1 })
  }, [])

  return (
    <nav className="nav-pill" aria-label="Primary navigation">
      <span
        aria-hidden
        className="nav-indicator"
        style={{
          left: indicator.left,
          width: indicator.width,
          opacity: indicator.ready ? 1 : 0,
        }}
      />

      <div className="tab-links" ref={tabsRef}>
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            ref={(node) => {
              btnRefs.current[tab] = node
            }}
            className={active === tab ? "active" : ""}
            aria-current={active === tab ? "page" : undefined}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <span className="nav-divider" aria-hidden />

      <div
        className="nav-actions"
        ref={actionsRef}
        onMouseLeave={() => moveHover(null)}
      >
        <span
          aria-hidden
          className="nav-action-hover"
          style={{ left: hover.left, width: hover.width, opacity: hover.opacity }}
        />
        {ACTIONS.map(({ key, label, Icon, size }) => (
          <button
            key={key}
            type="button"
            ref={(node) => {
              actionRefs.current[key] = node
            }}
            className="nav-action"
            aria-label={label}
            onMouseEnter={() => moveHover(key)}
            onFocus={() => moveHover(key)}
            onBlur={() => moveHover(null)}
            onClick={key === 'search' ? onSearchClick : onAccountClick}
          >
            <Icon width={size} height={size} aria-hidden />
          </button>
        ))}
      </div>
    </nav>
  )
}
