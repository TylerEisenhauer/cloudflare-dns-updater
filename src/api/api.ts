import axios, {AxiosInstance} from 'axios'
import {Zone} from '../types/zone'
import {DnsEntry} from '../types/dns-entry'

let client: AxiosInstance

export function initializeApiClient() {
    client = axios.create({
        baseURL: 'https://api.cloudflare.com/client/v4/',
        headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`
        }
    })
}

async function getZones(): Promise<Zone[]> {
    try {
        const {data} = await client.get('zones')
        return data.result
    } catch (e) {
        console.log(e)
    }
}

async function getDnsEntry(zoneId: string): Promise<DnsEntry[]> {
    try {
        const {data} = await client.get(`zones/${zoneId}/dns_records`, {
            params: {
                type: 'A'
            }
        })
        return data.result
    } catch (e) {
        console.log(e)
    }
}

async function updateDnsEntry(entry: DnsEntry) {
    try {
        const {data} = await client.put(`zones/${entry.zone_id}/dns_records/${entry.id}`, {
            type: entry.type,
            name: entry.name,
            content: entry.content,
            ttl: entry.ttl
        })
        return data.result
    } catch (e) {
        console.log(e)
    }
}

export default {
    getZones,
    getDnsEntry,
    updateDnsEntry
}