import pygame

# (1) - Inicializar Jogo
pygame.init()

dimensoes_tela = (800, 800)
tela = pygame.display.set_mode(dimensoes_tela)
pygame.display.set_caption("Brick Breaker - (Pygame)")

tam_bola = 15
bola = pygame.Rect(100, 500, tam_bola, tam_bola)

tam_jogador = 100
jogador = pygame.Rect(50, 700, tam_jogador, 15)  

qtd_lin_blocos = 8
qtd_col_blocos = 6
qtd_tot_blocos = qtd_lin_blocos * qtd_col_blocos

def criar_blocos(qtd_lin_blocos, qtd_col_blocos):
   blocos = []
   
   # Criar blocos
   for i in range(qtd_lin_blocos):
      for j in range(qtd_col_blocos):
         # Criar Bloco
         bloco = pygame.Rect(50 + (j * 120), 50 + (i * 30), tam_jogador, 15)
         # Adicionar ele á lista de Blocos
         blocos.append(bloco)
         
   return blocos

cores = {
   'preto': (0, 0, 0),
   'branco': (255, 255, 255),
   'azul': (0, 0, 255),
   'amarelo': (255, 255, 0),
   'vermelho': (255, 0, 0),
   'roxo': (128, 0, 128),
   'cinza': (128, 128, 128),
   'laranja': (255, 165, 0)
}

fim_de_jogo = False
pontuacao = 0
movimento_bola = [-1, -1]

# (2) - Criar funções do Jogo
def movimentar_jogador(evento):
   if evento.type == pygame.KEYDOWN:
      if evento.key == pygame.K_RIGHT:
         if jogador.x < 650:
            jogador.x = jogador.x + 2
         # Andar p/ Direita
      if evento.key == pygame.K_LEFT:
         if jogador.x > 50:
            jogador.x = jogador.x - 2
         # Andar p/ Esquerda

def movimentar_bola(bola):
   movimento = movimento_bola
   bola.x = bola.x + movimento[0]
   bola.y = bola.y + movimento[1]
   
   if bola.x <= 50:
      movimento[0] = -movimento[0]
   
   if bola.y <= 50:
      movimento[1] = -movimento[1]
      
   if bola.x + tam_bola >= 750:
      movimento[0] = -movimento[0]
      
   if bola.y + tam_bola >= 750:
      movimento = None
      
   if jogador.collidepoint(bola.x, bola.y):
      movimento[1] = -movimento[1]
      
   for bloco in blocos:
      if bloco.collidepoint(bola.x, bola.y):
         blocos.remove(bloco)
         movimento[1] = -movimento[1]
         
   return movimento

def atualizar_pontuacao(pontuacao):
   fonte = pygame.font.Font(None, 30)
   texto = fonte.render(f'Pontuação: {pontuacao}', 1, cores['laranja'])
   tela.blit(texto, (50, 750))
   
   if pontuacao >= qtd_tot_blocos:
      return True
   else:
      return False
   

# (3) - Criar objetos na tela
def desenhar_objetos():
   tela.fill(cores['preto'])
   pygame.draw.rect(tela, cores['cinza'], jogador)
   pygame.draw.rect(tela, cores['amarelo'], bola)

def desenhar_blocos(blocos):
   for bloco in blocos:
      pygame.draw.rect(tela, cores['branco'], bloco)

blocos = criar_blocos(qtd_lin_blocos, qtd_col_blocos)

# (4) - Criar loop Infinito
while not fim_de_jogo:
   desenhar_objetos()
   desenhar_blocos(blocos)
   
   fim_de_jogo = atualizar_pontuacao(qtd_tot_blocos - len(blocos))
   
   for evento in pygame.event.get():
      if evento.type == pygame.QUIT:
         fim_de_jogo = True
   
   movimentar_jogador(evento)
   
   movimento_bola = movimentar_bola(bola)
   
   if not movimento_bola:
      fim_de_jogo = True
   
   pygame.time.wait(1)
   pygame.display.flip()
   
pygame.quit()
