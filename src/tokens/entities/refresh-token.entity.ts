import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('text')
  token_hash: string;

  @Column('uuid')
  family_id: string;

  @Column({ type: 'boolean', default: false })
  is_revoked: boolean;

  @Column({ type: 'timestamptz' })
  issued_at: Date;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Column({ type: 'inet', nullable: true })
  ip_address?: string;

  @Column({ type: 'text', nullable: true })
  user_agent?: string;
}
