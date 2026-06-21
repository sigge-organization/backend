import { Request, Response } from "express";
import { MyAllEventsService } from "../../services/student_groups/MyAllEventsService";

class MyAllEventsController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const myAllEventsService = new MyAllEventsService();

    const events = await myAllEventsService.execute(user_id);

    return res.json(events);
  }
}

export { MyAllEventsController };
