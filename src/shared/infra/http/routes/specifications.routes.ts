import { Router } from 'express';

import { ensureAuthenticated } from '@shared/infra/http/midlewares/ensureAuthenticated';
import { ensureAdmin } from '@shared/infra/http/midlewares/ensureAdmin';

import { CreateSpecificationController } from '@modules/cars/useCases/createSpecification/CreateSpecificationController';

const specificationsRoutes = Router();

const createSpecificationsController = new CreateSpecificationController();

specificationsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createSpecificationsController.handle
);

export { specificationsRoutes };
