# Angular Patterns & Conventions

## Component Structure
```typescript
@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentName implements OnInit, OnDestroy {
  // Properties
  // Constructor with dependency injection
  // Lifecycle hooks
  // Public methods
  // Private methods
}
```

## Service Pattern
```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}
  
  getData(): Observable<DataModel[]> {
    return this.http.get<DataModel[]>('/api/endpoint')
      .pipe(
        catchError(this.handleError)
      );
  }
}
```

## Form Handling
```typescript
export class FormComponent {
  form: FormGroup;
  
  ngOnInit() {
    this.form = this.fb.group({
      field: ['', [Validators.required, Validators.email]]
    });
  }
}
```

## File Naming Conventions
- Components: `ComponentName.component.ts`
- Services: `ServiceName.service.ts`
- Models: `ModelName.model.ts`
- Interfaces: `InterfaceName.interface.ts`
- Guards: `GuardName.guard.ts`
- Pipes: `PipeName.pipe.ts` 
