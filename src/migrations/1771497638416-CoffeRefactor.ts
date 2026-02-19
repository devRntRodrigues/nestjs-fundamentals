import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeRefactor1771497638416 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" ADD COLUMN "recommendations" INTEGER NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" DROP COLUMN "recommendations"`,
    );
  }
}
