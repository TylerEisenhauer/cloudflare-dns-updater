import axios from 'axios'
import api, {initializeApiClient} from './api/api'
import {Zone} from './types/zone'
import {DnsEntry} from './types/dns-entry'
import {config} from 'dotenv'

config()
initializeApiClient()

const minutes = 1
const interval = minutes * 60 * 1000

let ipAddressCache: string

setInterval(async () => {
    const {data} = await axios.get('https://ifconfig.io/ip')
    const ipAddress = data.replace('\n', '')

    if (ipAddress !== ipAddressCache) {
        const zones: Zone[] = await api.getZones()

        for (let zone of zones) {
            const dnsEntries: DnsEntry[] = await api.getDnsEntry(zone.id)

            for (let entry of dnsEntries) {
                entry.content = ipAddress

                const newEntry = await api.updateDnsEntry(entry)
                console.log(`IP Address updated for ${newEntry.name}\n${JSON.stringify(newEntry, null, 2)}`)
            }
        }

        ipAddressCache = ipAddress
    }
}, interval)

