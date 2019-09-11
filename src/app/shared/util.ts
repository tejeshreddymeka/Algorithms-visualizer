export class Util {

  static delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
