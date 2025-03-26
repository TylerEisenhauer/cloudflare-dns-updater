import axios, { AxiosInstance } from 'axios'
import { Zone } from '../types/zone.js'
import { DnsEntry } from '../types/dns-entry.js'

let client: AxiosInstance

export function initializeApiClient() {
  client = axios.create({
    baseURL: 'https://api.cloudflare.com/client/v4/',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`
    }
  })
}

async function getIpAddress(): Promise<string> {
  try {
    const { data } = await axios.get('https://ifconfig.io/ip')
    return data.replace('\n', '')
  } catch (e) {
    console.log('Error getting ip address')
    throw e
  }
}

async function getZones(): Promise<Zone[]> {
  try {
    const { data } = await client.get('zones')
    return data.result
  } catch (e) {
    console.log('Error getting zones')
    throw e
  }
}

async function getDnsEntry(zoneId: string): Promise<DnsEntry[]> {
  try {
    const { data } = await client.get(`zones/${zoneId}/dns_records`, {
      params: {
        type: 'A'
      }
    })
    return data.result
  } catch (e) {
    console.log('Error getting dns entries')
    throw e
  }
}

async function updateDnsEntry(entry: DnsEntry) {
  try {
    const { data } = await client.put(`zones/${entry.zone_id}/dns_records/${entry.id}`, {
      type: entry.type,
      name: entry.name,
      content: entry.content,
      ttl: entry.ttl
    })
    return data.result
  } catch (e) {
    console.log('Error updating dns entries')
    throw e
  }
}

export default {
  getZones,
  getDnsEntry,
  updateDnsEntry,
  getIpAddress
}