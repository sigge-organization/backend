// src/routes/userRoutes.ts
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

// Recuperação de Senha

const passwordRecoveryController = new PasswordRecoveryController();
userRoutes.post('/forgot-password', passwordRecoveryController.forgotPassword);
userRoutes.post('/reset-password', passwordRecoveryController.resetPassword);
userRoutes.post('/logout', new LogoutUserController().handle);

export { userRoutes };