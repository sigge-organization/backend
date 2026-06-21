import { Router } from 'express';
import { CreateStudentGroupController } from '../controllers/student_groups/CreateStudentGroupController';
import { ListStudentGroupController } from '../controllers/student_groups/ListStudentGroupController';
import { GetStudentGroupController } from '../controllers/student_groups/GetStudentGroupController';
import { UpdateStudentGroupController } from '../controllers/student_groups/UpdateStudentGroupController';
import { DeleteStudentGroupController } from '../controllers/student_groups/DeleteStudentGroupController';
import { JoinStudentGroupController } from '../controllers/student_groups/JoinStudentGroupController';
import { CreateEventController } from '../controllers/events/CreateEventController';
import { ListEventsController } from '../controllers/events/ListEventsController';
import { UpdateEventController } from '../controllers/events/UpdateEventController';
import { DeleteEventController } from '../controllers/events/DeleteEventController';
import { CreatePostController } from '../controllers/posts/CreatePostController';
import { ListPostsController } from '../controllers/posts/ListPostsController';
import { CreateMaterialController } from '../controllers/materials/CreateMaterialController';
import { ListMaterialsController } from '../controllers/materials/ListMaterialsController';
import { UpdateMaterialController } from '../controllers/materials/UpdateMaterialController';
import { DeleteMaterialController } from '../controllers/materials/DeleteMaterialController';
import { MyWeeklyEventsController } from '../controllers/student_groups/MyWeeklyEventsController';
import { MyRecentMaterialsController } from '../controllers/student_groups/MyRecentMaterialsController';
import { RecentStudentGroupController } from '../controllers/student_groups/RecentStudentGroupController';
import { MyAllEventsController } from '../controllers/student_groups/MyAllEventsController';
import { MyAllMaterialsController } from '../controllers/student_groups/MyAllMaterialsController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isGroupMember } from '../middlewares/isGroupMember';
import { isGroupAdmin } from '../middlewares/isGroupAdmin';

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
studentGroupRoutes.get('/recent', new RecentStudentGroupController().handle);
studentGroupRoutes.get('/my/weekly-events', new MyWeeklyEventsController().handle);
studentGroupRoutes.get('/my/all-events', new MyAllEventsController().handle);
studentGroupRoutes.get('/my/recent-materials', new MyRecentMaterialsController().handle);
studentGroupRoutes.get('/my/all-materials', new MyAllMaterialsController().handle);
studentGroupRoutes.get('/:id', getStudentGroupController.handle);
studentGroupRoutes.put('/:id', isGroupAdmin, updateStudentGroupController.handle);
studentGroupRoutes.delete('/:id', isGroupAdmin, deleteStudentGroupController.handle);

studentGroupRoutes.post('/:studentGroupId/events', isGroupMember, createEventController.handle);
studentGroupRoutes.get('/:studentGroupId/events', isGroupMember, listEventsController.handle);
studentGroupRoutes.put('/:studentGroupId/events/:eventId', isGroupMember, new UpdateEventController().handle);
studentGroupRoutes.delete('/:studentGroupId/events/:eventId', isGroupMember, new DeleteEventController().handle);

studentGroupRoutes.post('/:studentGroupId/posts', isGroupMember, createPostController.handle);
studentGroupRoutes.get('/:studentGroupId/posts', isGroupMember, listPostsController.handle);

studentGroupRoutes.post('/:studentGroupId/materials', isGroupMember, createMaterialController.handle);
studentGroupRoutes.get('/:studentGroupId/materials', isGroupMember, listMaterialsController.handle);
studentGroupRoutes.put('/:studentGroupId/materials/:materialId', isGroupMember, new UpdateMaterialController().handle);
studentGroupRoutes.delete('/:studentGroupId/materials/:materialId', isGroupMember, new DeleteMaterialController().handle);

export { studentGroupRoutes };
