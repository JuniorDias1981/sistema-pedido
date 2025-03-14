document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('pedidoForm');
  const categoriaSelect = document.getElementById('categoriaSelect');
  const limparCamposButton = document.getElementById('limparCampos');
  const enviarWhatsAppSemEstoqueButton = document.getElementById('enviarWhatsApp');
  const salvarPDFSemEstoqueButton = document.getElementById('salvarPDFSemEstoque');
  const salvarPDFCompletoButton = document.getElementById('salvarPDFCompleto');
  const conferirPedidoButton = document.getElementById('conferirPedido');
  const abrirTutorialButton = document.getElementById('abrirTutorial');
  const voltarAoTopoButton = document.getElementById('voltarAoTopo');

 // Função para montar a mensagem
function montarMensagem(incluirEstoque = false) {
  const nomeCliente = document.getElementById('nomeCliente').value;
  const observacoes = document.getElementById('observacoes').value; // Captura as observações
  const produtos = document.querySelectorAll('input[name="produto"]:checked');
  const pedido = [];

  produtos.forEach(produto => {
    const linha = produto.closest('tr');
    const nomeProduto = produto.value;

    const estoqueDisponivel = linha.querySelector('td:nth-child(2) input').value || 'Não informado';
    const quantidadePedido = linha.querySelector('td:nth-child(3) input').value;

    if (quantidadePedido > 0) {
      const item = {
        nome: nomeProduto,
        quantidadePedido: quantidadePedido
      };
      if (incluirEstoque) {
        item.estoqueDisponivel = estoqueDisponivel;
      }
      pedido.push(item);
    }
  });

  if (pedido.length === 0) {
    return null;
  }

  let mensagem = `*Pedido de ${nomeCliente}*\n\n`;

  // Incluir observações, se houver
  if (observacoes.trim() !== '') {
    mensagem += `*Observações:* ${observacoes}\n\n`;
  }

  // Montar lista de produtos com marcadores
  pedido.forEach(item => {
    mensagem += `- *${item.nome}* - Quantidade: ${item.quantidadePedido}\n`;
    if (incluirEstoque) {
      mensagem += `  Estoque Disponível: ${item.estoqueDisponivel}\n`;
    }
  });

  return mensagem;
}
  // Rolagem para a categoria selecionada
  categoriaSelect.addEventListener('change', function () {
    const categoriaId = this.value;
    if (categoriaId) {
      const categoriaElement = document.getElementById(categoriaId);
      if (categoriaElement) {
        categoriaElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Envio para WhatsApp (Sem Estoque)
  enviarWhatsAppSemEstoqueButton.addEventListener('click', function () {
    const mensagem = montarMensagem(false); // Sem estoque
    if (!mensagem) {
      alert('Nenhum produto selecionado para enviar.');
      return;
    }

    const numeroPadrao = '+5522997407901'; // Número padrão
    const url = `https://wa.me/${numeroPadrao}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  });

  // Salvamento em PDF (Sem Estoque)
  salvarPDFSemEstoqueButton.addEventListener('click', function () {
    const mensagem = montarMensagem(false); // Sem estoque
    if (!mensagem) {
      alert('Nenhum produto selecionado para salvar em PDF.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(mensagem.split('\n'), 10, 10); // Adiciona texto ao PDF
    doc.save('pedido_sem_estoque.pdf');
  });

  // Salvamento em PDF (Estoque + Pedido)
  salvarPDFCompletoButton.addEventListener('click', function () {
    const mensagem = montarMensagem(true); // Com estoque
    if (!mensagem) {
      alert('Nenhum produto selecionado para salvar em PDF.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(mensagem.split('\n'), 10, 10); // Adiciona texto ao PDF
    doc.save('pedido_completo.pdf');
  });

  // Conferir Pedido (Modal)
  conferirPedidoButton.addEventListener('click', function () {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    // Limpar conteúdo anterior
    modalBody.innerHTML = '';

    // Montar mensagem do pedido
    const mensagem = montarMensagem(true); // Com estoque
    if (!mensagem) {
      alert('Nenhum produto selecionado para conferir.');
      return;
    }

    modalBody.innerHTML = mensagem.replace(/\n/g, '<br>'); // Converter quebras de linha para HTML
    modal.style.display = 'block'; // Mostrar modal
  });

  // Fechar modal ao clicar no botão "Fechar"
  document.getElementById('fecharModal').addEventListener('click', function () {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; // Ocultar modal
  });

  // Fechar modal ao clicar no ícone ×
  document.querySelector('.close').addEventListener('click', function () {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; // Ocultar modal
  });

  // Fechar modal ao clicar fora da área do modal
  window.addEventListener('click', function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      modal.style.display = 'none'; // Ocultar modal
    }
  });

  // Limpar todos os campos
  limparCamposButton.addEventListener('click', function () {
    if (confirm('Tem certeza de que deseja limpar todos os campos?')) {
      form.reset();
      localStorage.removeItem('pedidoDados');
      alert('Todos os campos foram limpos!');
    }
  });

  // Abrir Tutorial de Uso
  abrirTutorialButton.addEventListener('click', function () {
    window.open('tuto.html', '_blank'); // Abre o arquivo tuto.html em uma nova aba
  });

  // Botão Voltar ao Topo
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      voltarAoTopoButton.style.display = 'block'; // Mostra o botão quando o usuário rola a página
    } else {
      voltarAoTopoButton.style.display = 'none'; // Oculta o botão quando o usuário está no topo
    }
  });

  voltarAoTopoButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
  });
});