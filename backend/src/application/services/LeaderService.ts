import { LeaderRepository } from "../../infrastructure/repositories/LeaderRepository";
import {
  IRequestUsersByLeader,
  IRequestAccessByLeader,
  IRequestEquipmentByLeader,
} from "../../domain/repositories/ILeaderRepository";

export class LeaderService {
  private leaderRepository: LeaderRepository;

  constructor() {
    this.leaderRepository = new LeaderRepository();
  }
  async getRequestUsersByLeader(
    leaderId: number
  ): Promise<IRequestUsersByLeader[]> {
    return await this.leaderRepository.getRequestUsersByLeader(leaderId);
  }

  async getRequestAccessByLeader(
    leaderId: number
  ): Promise<IRequestAccessByLeader[]> {
    return await this.leaderRepository.getRequestAccessByLeader(leaderId);
  }

  async getRequestEquipmentByLeader(
    leaderId: number
  ): Promise<IRequestEquipmentByLeader[]> {
    return await this.leaderRepository.getRequestEquipmentByLeader(leaderId);
  }
}
