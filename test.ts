import { MaintenanceOrderQueryService } from './src/services/maintenance/maintenance-order-query.service';

MaintenanceOrderQueryService.getOrders({estado: ['PENDIENTE', 'EN_REVISION'], pageSize: 100}).then((res: any) => console.dir(res, {depth: null}));
