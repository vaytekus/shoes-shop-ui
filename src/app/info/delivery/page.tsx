import { Package, CreditCard } from 'lucide-react'

export default function DeliveryPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Доставка та оплата</h1>

      <div className="space-y-3">
        <Package className="w-12 h-12 text-gray-400" />
        <p className="text-sm text-gray-400 uppercase tracking-wide">Способи доставки</p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>— У відділення / поштомат Нової пошти: від 80 грн, 1–3 дні</li>
          <li>— Кур'єром Нової пошти: від 100 грн, 1–3 дні</li>
        </ul>
      </div>

      <div className="space-y-3">
        <CreditCard className="w-12 h-12 text-gray-400" />
        <p className="text-sm text-gray-400 uppercase tracking-wide">Способи оплати</p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>— Переказ на банківську карту: надішлемо реквізити</li>
          <li>— Онлайн оплата: VISA / MasterCard та Apple / Google Pay</li>
          <li>— Оплата при отриманні: у відділенні Нової пошти</li>
        </ul>
      </div>
    </div>
  )
}
