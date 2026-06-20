import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
// Controllers Existentes
import { AuthUserController } from '../controllers/users/AuthUserController';
import { CreateUserController } from '../controllers/users/CreateUserController';
import { GetMeController } from '../controllers/users/GetMeController';
import { ListAllUsersController } from '../controllers/users/ListAllUserController';
import { EditUserController } from '../controllers/users/EditUserController';
import { LogoutUserController } from '../controllers/users/LogoutUserController';
import { PasswordRecoveryController } from '../controllers/users/PasswordRecoveryController';
import { ChangePasswordController } from '../controllers/users/ChangePasswordController';
import { VerifyPasswordController } from '../controllers/users/VerifyPasswordController';
const userRoutes = Router();

const authUserController = new AuthUserController();
const createUserController = new CreateUserController();

userRoutes.post('/login', authUserController.handle);

// Rota de Registro (Cadastro)
userRoutes.post('/register', createUserController.handle);

// --- Rotas Protegidas ---
// Rota para obter dados do usuário autenticado
const getMeController = new GetMeController(); 
userRoutes.get('/me', isAuthenticated, getMeController.handle); 


// Rota para listar TODOS os usuários do sistema
const listAllUsersController = new ListAllUsersController();
userRoutes.get('/all', isAuthenticated, listAllUsersController.handle);


// Edição de Perfil
const editUserController = new EditUserController();
userRoutes.put('/edit', isAuthenticated, editUserController.handle);

// Alteração de Senha (Autenticado)
const changePasswordController = new ChangePasswordController();
const verifyPasswordController = new VerifyPasswordController();
userRoutes.post('/change-password', isAuthenticated, changePasswordController.handle);
userRoutes.post('/verify-password', isAuthenticated, verifyPasswordController.handle);

// Recuperação de Senha

const passwordRecoveryController = new PasswordRecoveryController();
userRoutes.post('/forgot-password', passwordRecoveryController.forgotPassword);
userRoutes.post('/reset-password', passwordRecoveryController.resetPassword);
userRoutes.post('/logout', new LogoutUserController().handle);

export { userRoutes };