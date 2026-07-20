/**
 * Dispatch feature — the owner-operator's core MVP experience.
 *
 * Public surface for the feature module. The dashboard page composes
 * `DispatchDashboard`; everything else (state machine, types, sources,
 * formatting, sample data) is an implementation detail exported here for reuse
 * and future integration work (DAT, Truckstop, Sylectus, direct brokers).
 */
export { DispatchDashboard, type DispatchDashboardProps } from './components/DispatchDashboard';
export { useDispatch, type UseDispatchResult } from './useDispatch';
export { DISPATCH_SOURCES, sourceByKey } from './sources';
export type {
  AvailabilityStatus,
  CurrentLoad,
  CurrentLoadStatus,
  DispatchPhase,
  DispatchSource,
  LoadOffer,
  LocationMode,
  OperatorLocation,
} from './types';
