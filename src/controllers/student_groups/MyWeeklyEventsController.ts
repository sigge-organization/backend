import { Request, Response } from "express";
import { MyWeeklyEventsService } from "../../services/student_groups/MyWeeklyEventsService";

class MyWeeklyEventsController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const myWeeklyEventsService = new MyWeeklyEventsService();

    const events = await myWeeklyEventsService.execute(user_id);

    return res.json(events);
  }
}

export { MyWeeklyEventsController };
