import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("error_logs")
export class ErrorLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  stack: string;

  @CreateDateColumn()
  date: Date;
}
