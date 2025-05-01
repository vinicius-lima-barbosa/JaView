import { userSchemaZod } from '../src/services/userValidation';

describe('userSchemaZod', () => {
  it('valida dados corretos com sucesso', () => {
    const result = userSchemaZod.safeParse({
      name: 'Fulano',
      email: 'fulano@email.com',
      password: '123456',
      confirmedPassword: '123456'
    });

    expect(result.success).toBe(true);
  });

  it('retorna erro se o nome for vazio', () => {
    const result = userSchemaZod.safeParse({
      name: '',
      email: 'teste@email.com',
      password: '123456',
      confirmedPassword: '123456'
    });
    console.log(JSON.stringify(result, null, 2));

    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.errors[0].message).toBe('The name is required!');
    }
  });

  it('retorna erro se o email for inválido', () => {
    const result = userSchemaZod.safeParse({
      name: 'Fulano',
      email: 'email_invalido',
      password: '123456',
      confirmedPassword: '123456'
    });

    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.errors[0].message).toBe('Invalid email format!');
    }
});

  it('retorna erro se a senha tiver menos de 6 caracteres', () => {
    const result = userSchemaZod.safeParse({
      name: 'Fulano',
      email: 'email@email.com',
      password: '123',
      confirmedPassword: '123'
    });

    expect(result.success).toBe(false);
    if (!result.success){
        expect(result.error.errors[0].message).toBe('The password must have at leats 6 characters!');
    }
  });

  it('retorna erro se as senhas forem diferentes', () => {
    const result = userSchemaZod.safeParse({
      name: 'Fulano',
      email: 'email@email.com',
      password: '123456',
      confirmedPassword: 'outraSenha'
    });

    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.errors[0].message).toBe('The password must be the same!');
    }
  });
});
