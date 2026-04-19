import { Pipe, PipeTransform, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { interval, shareReplay } from 'rxjs';

// import { CountdownService } from './countdown.service';

@Injectable({ providedIn: 'root' })
class CountdownService {
  tick$ = interval(1000).pipe(
    shareReplay(1) // 🔥 all pipes share ONE timer
  );
}

@Pipe({
  name: 'countdown',
  standalone: true,
  pure: true // 🔥 VERY IMPORTANT
})
export class CountdownPipe implements PipeTransform {

  private countdownService = inject(CountdownService);

  transform(targetDate: Date | string | number, addHours: number = 0, format: any = 'string', source: any = 0) {

    const start = new Date(
      typeof targetDate === 'number'
        ? targetDate * 1000
        : typeof targetDate === 'string' && /^\d+$/.test(targetDate)
          ? parseInt(targetDate) * 1000
          : targetDate
    ).getTime();

    const settleAt = addHours ? start + addHours * 3600000 : start;

    return this.countdownService.tick$.pipe(
      map(() => {
        const diff = settleAt - Date.now();

        if (diff <= 0) return null;

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (format === 'data') {
          return `${days}${hours}${minutes}${seconds}`;
        }

        return `${days ? days + 'd ' : ''}${hours}h ${minutes
          .toString()
          .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
      })
    );
  }
}
