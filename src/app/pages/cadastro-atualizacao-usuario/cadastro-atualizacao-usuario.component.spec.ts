import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAtualizacaoUsuarioComponent } from './cadastro-atualizacao-usuario.component';

describe('CadastroAtualizacaoUsuarioComponent', () => {
  let component: CadastroAtualizacaoUsuarioComponent;
  let fixture: ComponentFixture<CadastroAtualizacaoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroAtualizacaoUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroAtualizacaoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
