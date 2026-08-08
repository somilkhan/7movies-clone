"use client"

import { useAppStore } from "@/stores/useAppStore"
import SearchDialog from "./SearchDialog"
import AccountDialog from "./AccountDialog"

export function DialogRenderer() {
  const { searchOpen, setSearchOpen, accountOpen, setAccountOpen } = useAppStore()

  return (
    <>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
      {accountOpen && <AccountDialog onClose={() => setAccountOpen(false)} />}
    </>
  )
}
