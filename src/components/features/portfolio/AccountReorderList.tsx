'use client'

import { useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { toast } from 'sonner'
import { AccountCard } from './AccountCard'
import { reorderAccountsAction } from '@/app/(app)/portfolio/actions'
import type { PortfolioAccount } from '@/lib/types/database'

interface AccountReorderListProps {
  accounts: PortfolioAccount[]
  onEdit: (account: PortfolioAccount) => void
}

export function AccountReorderList({ accounts, onEdit }: AccountReorderListProps) {
  const [order, setOrder] = useState(accounts)

  // Re-sync when the server sends a fresh list (e.g. after revalidate), unless it already matches.
  const [prev, setPrev] = useState(accounts)
  if (accounts !== prev) {
    setPrev(accounts)
    const sameOrder =
      accounts.length === order.length &&
      accounts.every((a, i) => a.id === order[i]?.id && a.current_amount === order[i]?.current_amount)
    if (!sameOrder) setOrder(accounts)
  }

  // Persist on drag end. Framer invokes the latest onDragEnd, so `order` here is current.
  const commit = () => {
    void (async () => {
      const res = await reorderAccountsAction(order.map((a) => a.id))
      if (res?.error) toast.error(res.error)
    })()
  }

  return (
    <Reorder.Group axis="y" values={order} onReorder={setOrder} as="div" className="space-y-3">
      {order.map((account) => (
        <AccountReorderItem key={account.id} account={account} onEdit={onEdit} onCommit={commit} />
      ))}
    </Reorder.Group>
  )
}

function AccountReorderItem({
  account,
  onEdit,
  onCommit,
}: {
  account: PortfolioAccount
  onEdit: (account: PortfolioAccount) => void
  onCommit: () => void
}) {
  const controls = useDragControls()

  return (
    <Reorder.Item
      value={account}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onCommit}
      as="div"
      className="touch-pan-y"
    >
      <AccountCard
        account={account}
        onClick={() => onEdit(account)}
        onHandlePointerDown={(e) => controls.start(e)}
      />
    </Reorder.Item>
  )
}
