import api, { initializeApiClient } from './api/api.js'
import { Zone } from './types/zone.js'
import { DnsEntry } from './types/dns-entry.js'
import { config } from 'dotenv'

config()
initializeApiClient()

const minutes = 1
const interval = minutes * 60 * 1000

let ipAddressCache: string = await api.getIpAddress()
await updateIpAddress(ipAddressCache)

setInterval(async () => {
  try {
    const ipAddress = await api.getIpAddress()

    if (ipAddress !== ipAddressCache) {
      await updateIpAddress(ipAddress)

      ipAddressCache = ipAddress
    }
  } catch (e) {
    console.log(e.message)
  }
}, interval)

async function updateIpAddress(ipAddress: string) {
  const zones: Zone[] = await api.getZones()

  for (let zone of zones) {
    const dnsEntries: DnsEntry[] = await api.getDnsEntry(zone.id)

    for (let entry of dnsEntries) {
      entry.zone_id = zone.id
      entry.content = ipAddress

      const newEntry = await api.updateDnsEntry(entry)
      console.log(`IP Address updated for ${newEntry.name}\n${JSON.stringify(newEntry, null, 2)}`)
    }
  }
}