import { Router } from 'express';
import { CreateStudentGroupController } from '../controllers/student_groups/CreateStudentGroupController';
import { ListStudentGroupController } from '../controllers/student_groups/ListStudentGroupController';
import { GetStudentGroupController } from '../controllers/student_groups/GetStudentGroupController';
import { UpdateStudentGroupController } from '../controllers/student_groups/UpdateStudentGroupController';
import { DeleteStudentGroupController } from '../controllers/student_groups/DeleteStudentGroupController';
import { JoinStudentGroupController } from '../controllers/student_groups/JoinStudentGroupController';
import { CreateEventController } from '../controllers/events/CreateEventController';
import { ListEventsController } from '../controllers/events/ListEventsController';
import { CreatePostController } from '../controllers/posts/CreatePostController';
import { ListPostsController } from '../controllers/posts/ListPostsController';
import { CreateMaterialController } from '../controllers/materials/CreateMaterialController';
import { ListMaterialsController } from '../controllers/materials/ListMaterialsController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isGroupMember } from '../middlewares/isGroupMember';

const studentGroupRoutes = Router();

const createStudentGroupController = new CreateStudentGroupController();
const listStudentGroupController = new ListStudentGroupController();
const getStudentGroupController = new GetStudentGroupController();
const updateStudentGroupController = new UpdateStudentGroupController();
const deleteStudentGroupController = new DeleteStudentGroupController();
const joinStudentGroupController = new JoinStudentGroupController();

const createEventController = new CreateEventController();
const listEventsController = new ListEventsController();
const createPostController = new CreatePostController();
const listPostsController = new ListPostsController();
const createMaterialController = new CreateMaterialController();
const listMaterialsController = new ListMaterialsController();

studentGroupRoutes.use(isAuthenticated);

studentGroupRoutes.post('/join', joinStudentGroupController.handle);
studentGroupRoutes.post('/', createStudentGroupController.handle);
studentGroupRoutes.get('/', listStudentGroupController.handle);
studentGroupRoutes.get('/:id', getStudentGroupController.handle);
studentGroupRoutes.put('/:id', updateStudentGroupController.handle);
studentGroupRoutes.delete('/:id', deleteStudentGroupController.handle);

studentGroupRoutes.post('/:studentGroupId/events', isGroupMember, createEventController.handle);
studentGroupRoutes.get('/:studentGroupId/events', isGroupMember, listEventsController.handle);

studentGroupRoutes.post('/:studentGroupId/posts', isGroupMember, createPostController.handle);
studentGroupRoutes.get('/:studentGroupId/posts', isGroupMember, listPostsController.handle);

studentGroupRoutes.post('/:studentGroupId/materials', isGroupMember, createMaterialController.handle);
studentGroupRoutes.get('/:studentGroupId/materials', isGroupMember, listMaterialsController.handle);

export { studentGroupRoutes };
