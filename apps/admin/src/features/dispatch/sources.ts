import type { DispatchSource } from './types';

/**
 * The sources the dispatch team searches on the operator's behalf.
 *
 * This is the seam for future load-board integrations. Each entry maps to a
 * provider we intend to connect (DAT, Truckstop, Sylectus, direct brokers,
 * etc.). `integrationReady` is `false` for every source today because these are
 * visual workflow states only — no load board is integrated yet. When an
 * integration lands, flip its flag and wire a provider adapter keyed by `key`.
 */
export const DISPATCH_SOURCES: readonly DispatchSource[] = [
  {
    key: 'direct_brokers',
    label: 'Direct Brokers',
    searchingLabel: 'Searching Direct Brokers',
    integrationReady: false,
  },
  {
    key: 'dat',
    label: 'DAT',
    searchingLabel: 'Searching DAT',
    integrationReady: false,
  },
  {
    key: 'truckstop',
    label: 'Truckstop',
    searchingLabel: 'Searching Truckstop',
    integrationReady: false,
  },
  {
    key: 'sylectus',
    label: 'Sylectus',
    searchingLabel: 'Searching Sylectus',
    integrationReady: false,
  },
  {
    key: 'private_customers',
    label: 'Private Customers',
    searchingLabel: 'Searching Private Customers',
    integrationReady: false,
  },
  {
    key: 'dedicated',
    label: 'Dedicated Opportunities',
    searchingLabel: 'Searching Dedicated Opportunities',
    integrationReady: false,
  },
] as const;

/** Look up a source definition by key. */
export function sourceByKey(key: DispatchSource['key']): DispatchSource | undefined {
  return DISPATCH_SOURCES.find((source) => source.key === key);
}
