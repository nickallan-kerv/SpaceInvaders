export class ScoreService {
  private score = 0;

  public reset(): void {
    this.score = 0;
  }

  public add(points: number): void {
    this.score += points;
  }

  public current(): number {
    return this.score;
  }
}
