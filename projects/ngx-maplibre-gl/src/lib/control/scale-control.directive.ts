import {
  AfterContentInit,
  Directive,
  Host,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ScaleControl, ScaleControlOptions } from 'maplibre-gl';
import { MapService } from '../map/map.service';
import { ControlComponent } from './control.component';

@Directive({
  selector: '[mglScale]',
  standalone: true,
})
export class ScaleControlDirective implements AfterContentInit, OnChanges {
  /* Init inputs */
  @Input() maxWidth?: number;

  /* Dynamic inputs */
  @Input() unit?: 'imperial' | 'metric' | 'nautical';

  constructor(
    private mapService: MapService,
    @Host() private controlComponent: ControlComponent<ScaleControl>
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.unit && !changes.unit.isFirstChange()) {
      (this.controlComponent.control as ScaleControl).setUnit(
        changes.unit.currentValue
      );
    }
  }

  ngAfterContentInit() {
    this.mapService.mapCreated$.subscribe(() => {
      if (this.controlComponent.control) {
        throw new Error('Another control is already set for this control');
      }
      const options: ScaleControlOptions = {};
      if (this.maxWidth !== undefined) {
        options.maxWidth = this.maxWidth;
      }
      if (this.unit !== undefined) {
        options.unit = this.unit;
      }
      this.controlComponent.control = new ScaleControl(options);
      this.mapService.addControl(
        this.controlComponent.control,
        this.controlComponent.position
      );
    });
  }
}
