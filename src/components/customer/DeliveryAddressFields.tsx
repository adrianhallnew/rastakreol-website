'use client'

import { useState } from 'react'
import { DISTRICTS_BY_ISLAND } from '../../lib/seychelles-districts'
import type { Customer } from '../../payload-types'

const inputClass = 'rounded-sm border border-brand-stone px-3 py-2 text-base min-h-11'
const labelClass = 'flex flex-col gap-1 text-sm text-brand-ink'
const OTHER_DISTRICT = '__other__'

type Island = 'mahe' | 'praslin' | 'la_digue' | 'other' | ''

function hasDistrictList(island: Island): island is 'mahe' | 'praslin' {
  return island === 'mahe' || island === 'praslin'
}

export function DeliveryAddressFields({ customer }: { customer: Customer }) {
  const initialIsland = (customer.island ?? '') as Island
  const initialDistrict = customer.district ?? ''
  const initialMatch = hasDistrictList(initialIsland) && DISTRICTS_BY_ISLAND[initialIsland].includes(initialDistrict)

  const [island, setIsland] = useState<Island>(initialIsland)
  const [districtSelect, setDistrictSelect] = useState(
    hasDistrictList(initialIsland) ? (initialMatch ? initialDistrict : OTHER_DISTRICT) : '',
  )
  const [manualDistrict, setManualDistrict] = useState(initialMatch ? '' : initialDistrict)

  const districtOptions = hasDistrictList(island) ? DISTRICTS_BY_ISLAND[island] : []
  const showManualInput = districtOptions.length === 0 || districtSelect === OTHER_DISTRICT
  const resolvedDistrict = showManualInput ? manualDistrict : districtSelect

  return (
    <>
      <label className={labelClass}>
        Address line 1
        <input name="address_line1" type="text" defaultValue={customer.address_line1 ?? ''} className={inputClass} />
      </label>
      <label className={labelClass}>
        Address line 2
        <input name="address_line2" type="text" defaultValue={customer.address_line2 ?? ''} className={inputClass} />
      </label>
      <label className={labelClass}>
        Island
        <select
          name="island"
          value={island}
          onChange={(e) => {
            setIsland(e.target.value as Island)
            setDistrictSelect('')
            setManualDistrict('')
          }}
          className={inputClass}
        >
          <option value="">Select an island</option>
          <option value="mahe">Mahé</option>
          <option value="praslin">Praslin</option>
          <option value="la_digue">La Digue</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label className={labelClass}>
        District
        {districtOptions.length > 0 && (
          <select
            value={districtSelect}
            onChange={(e) => setDistrictSelect(e.target.value)}
            className={inputClass}
          >
            <option value="">Select a district</option>
            {districtOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
            <option value={OTHER_DISTRICT}>Other (type manually)</option>
          </select>
        )}
        {showManualInput && (
          <input
            type="text"
            value={manualDistrict}
            onChange={(e) => setManualDistrict(e.target.value)}
            className={inputClass}
          />
        )}
      </label>
      <input type="hidden" name="district" value={resolvedDistrict} />
    </>
  )
}
