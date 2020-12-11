import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { getRepository, Not, Repository } from 'typeorm';
import User from '../entities/User';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAll(): Promise<User[]> {
    const users = await this.ormRepository.find();

    return users;
  }

  public async listAttendantes(except_user_id: string): Promise<User[]> {
    const users = await this.ormRepository.find({
      where: {
        clerk: Not('null'),
        id: Not(except_user_id),
      },
    });

    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { email },
    });

    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne(id);

    return findUser;
  }

  public async create({
    email,
    name,
    password,
    clerk,
  }: ICreateUserDTO): Promise<User> {
    const response = await this.ormRepository.create({
      name,
      email,
      password,
      clerk,
    });

    const user = await this.save(response);

    return user;
  }

  public async save(user: User): Promise<User> {
    const userSaved = await this.ormRepository.save(user);

    return userSaved;
  }
}

export default UserRepository;
