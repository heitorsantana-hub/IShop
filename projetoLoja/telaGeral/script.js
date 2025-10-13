function compra()
{

  const modal = document.getElementById('modal');
  const abrir = document.getElementById('fone');
  const fechar = document.getElementById('fechar');

  // quando clicar no botão, mostra o modal
  abrir.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  // botão fechar
  fechar.addEventListener('click', () => {
    modal.style.display = 'none';
  });


}