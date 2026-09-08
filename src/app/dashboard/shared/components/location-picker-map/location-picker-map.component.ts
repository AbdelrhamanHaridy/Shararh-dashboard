// shared/components/location-picker-map/location-picker-map.component.ts
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';

export interface LatLngValue {
  lat: number;
  long: number;
}

// Default center when no coordinates are set yet (Cairo, Egypt)
const DEFAULT_CENTER: L.LatLngExpression = [30.0444, 31.2357];
const DEFAULT_ZOOM = 12;
const SELECTED_ZOOM = 15;
@Component({
  selector: 'app-location-picker-map',
  standalone: true,
  templateUrl: './location-picker-map.component.html',
  styleUrl: './location-picker-map.component.scss',
})
export class LocationPickerMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  // Current value — pass the form's lat/long in; component reflects it visually
  @Input() lat: number | null = null;
  @Input() long: number | null = null;
  @Input() height: string = '320px';

  // Emits whenever the user picks a new point (click or drag)
  @Output() locationChange = new EventEmitter<LatLngValue>();

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private marker: L.Marker | null = null;
  private viewInitialized = false;
  private markerIcon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });

  ngAfterViewInit(): void {
    this.initMap();
    this.viewInitialized = true;
    this.syncMarkerFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewInitialized) return;
    if (changes['lat'] || changes['long']) {
      this.syncMarkerFromInputs();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Clicking anywhere on the map places/moves the marker there
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.setMarker(event.latlng.lat, event.latlng.lng);
      this.emitChange(event.latlng.lat, event.latlng.lng);
    });
  }

  private syncMarkerFromInputs(): void {
    if (this.lat == null || this.long == null) return;
    this.setMarker(this.lat, this.long);
    this.map.setView([this.lat, this.long], SELECTED_ZOOM);
  }

  private setMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
      return;
    }

    this.marker = L.marker([lat, lng], {
      draggable: true,
      icon: this.markerIcon,
    }).addTo(this.map);
    this.marker.on('dragend', () => {
      const pos = this.marker!.getLatLng();
      this.emitChange(pos.lat, pos.lng);
    });
  }

  private emitChange(lat: number, long: number): void {
    this.locationChange.emit({ lat, long });
  }

  setExternalLocation(lat: number, long: number): void {
    this.setMarker(lat, long);
    this.map.setView([lat, long], SELECTED_ZOOM);
    this.emitChange(lat, long);
  }
}
