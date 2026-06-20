import { Router } from 'express';
import { CreateStudentGroupController } from '../controllers/student_groups/CreateStudentGroupController';
import { ListStudentGroupController } from '../controllers/student_groups/ListStudentGroupController';
import { GetStudentGroupController } from '../controllers/student_groups/GetStudentGroupController';
import { UpdateStudentGroupController } from '../controllers/student_groups/UpdateStudentGroupController';
import { DeleteStudentGroupController } from '../controllers/student_groups/DeleteStudentGroupController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const studentGroupRoutes = Router();

const createStudentGroupController = new CreateStudentGroupController();
const listStudentGroupController = new ListStudentGroupController();
const getStudentGroupController = new GetStudentGroupController();
const updateStudentGroupController = new UpdateStudentGroupController();
const deleteStudentGroupController = new DeleteStudentGroupController();

studentGroupRoutes.use(isAuthenticated);

studentGroupRoutes.post('/', createStudentGroupController.handle);
studentGroupRoutes.get('/', listStudentGroupController.handle);
studentGroupRoutes.get('/:id', getStudentGroupController.handle);
studentGroupRoutes.put('/:id', updateStudentGroupController.handle);
studentGroupRoutes.delete('/:id', deleteStudentGroupController.handle);

export { studentGroupRoutes };
