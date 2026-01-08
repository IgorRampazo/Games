// TODO: Variáveis - Tela
const [maxX, maxY] = [window.innerWidth - 10, window.innerHeight - 10];
const [minX, minY] = [10, 10];

// TODO: Variáveis - Sprites, Personagem e Moedas
const [nSprite, sizeSprite] = [10, 75];
// ? Variáveis - Personagem
const [charW, charH] = [64, 100];
const [swordW, swordH] = [40, 40];
let posX = (window.innerWidth / 2) - (charW / 2);
let posY = (window.innerHeight / 2) - (charH / 2);
let passo = 15, qtdSprite = 3, frame = 1;
// ? Variáveis - Moedas
const [nMoedas, sizeMoeda] = [10, 35];
// ? Variáveis Auxiliares
let fimDeJogo = false;
let [pontos, mortos] = [0, 0]; 
let ataque = true, dicAtaque = 'atackRight';

// * Métodos Auxliares
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const atualizaScore = (score) => document.querySelector('.moedas').textContent = `${score}`.padStart(2, 0);
const atualizaMortos = (mortos) => document.querySelector('.sprites').textContent = `${mortos}`.padStart(2, 0);
const getSize = (w, h) => `width: ${w}px; height: ${h}px;`;

// * Métodos Principais * //
function getPos()
{
   let x = random(minX, maxX - sizeSprite);
   let y = random(minY, maxY - sizeSprite);
   
   // Coordenadas do personagem
   const personagem = document.querySelector('.personagem').getBoundingClientRect();
   const { left: personL, top: personT, right: personR, bottom: personB } = personagem;
   // Coordenadas do placar
   const placar = document.querySelector('.placar').getBoundingClientRect();
   const { left: placarL, top: placarT, right: placarR, bottom: placarB } = placar;

   while 
   (
      (x + sizeSprite > personL && x < personR && y + sizeSprite > personT && y < personB) ||
      (x + sizeSprite > placarL && x < placarR && y + sizeSprite > placarT && y < placarB)
   ) 
   {
      x = random(minX, maxX - sizeSprite);
      y = random(minY, maxY - sizeSprite);
   }

   return [x, y];
}

function colisao(elemento1, elemento2, pad = 0)
{
   const e1 = elemento1.getBoundingClientRect();
   const e2 = elemento2.getBoundingClientRect();

   return !(e1.right - pad < e2.left + pad || e1.left + pad > e2.right - pad || e1.bottom - pad < e2.top + pad || e1.top + pad > e2.bottom - pad);
}

function movimentaPersonagem(direcao, personagem, image)
{
   let sword = document.querySelector('.sword');
   const placar = document.querySelector('.placar');
   const placarXY = placar.getBoundingClientRect();
   const { left: placarL, top: placarT, right: placarR, bottom: placarB } = placarXY;

   if (direcao === 'right' && !(posX + charW + passo > placarL && posX + passo < placarR && posY + charH > placarT && posY < placarB))
   {
      posX += passo, personagem.style.left = `${posX}px`;
      sword.style.transform = 'scaleX(1)';
      sword.style.left = `calc(50% - ${(swordW / 2) - 25}px)`;
      dicAtaque = 'atackRight';
   }

   else if (direcao === 'left' && !(posX - passo < placarR && posX - passo + charW > placarL && posY + charH > placarT && posY < placarB))
   {
      posX -= passo, personagem.style.left = `${posX}px`;
      sword.style.transform = 'scaleX(-1)';
      sword.style.left = `calc(50% - ${(swordW / 2) + 30}px)`;
      dicAtaque = 'atackLeft';
   }

   else if (direcao === 'up' && !(posY - passo < placarB && posY - passo + charH > placarT && posX + charW > placarL && posX < placarR))
      posY -= passo, personagem.style.top = `${posY}px`;

   else if (direcao === 'down' && !(posY + charH + passo > placarT && posY + passo < placarB && posX + charW > placarL && posX < placarR))
      posY += passo, personagem.style.top = `${posY}px`;

   personagem.style.backgroundImage = `url(./assets/img/character/${image}`;
   personagem.style.backgroundPosition = `${(frame % qtdSprite) * charW}px 0`;
   frame++;
}

function atack(sword)
{
   sword.classList.add(dicAtaque);
   ataque = false;

   const sprites = document.querySelectorAll('.sprite');

   setTimeout(() =>
   {
      sprites.forEach((sprite, i) =>
      {
         if (colisao(sword, sprite))
         {
            sprite.classList.add('death');
            atualizaMortos(++mortos);

            setTimeout(() =>
            {
               if (mortos === nSprite)
                  finalizar(colisaoSprite, colisaoMoeda);
            }, 800);
         }
      });

      sword.classList.remove(dicAtaque);
      ataque = true;
   }, 1000);
}

function gerarSprites(num = 0)
{
   for (let i = 0; i < num; i++)
   {
      const sprite = document.createElement('div');
      const [x, y] = getPos('sprite');

      sprite.style.position = 'absolute';
      sprite.classList.add('sprite');
      sprite.style.cssText += `width: ${sizeSprite}px; height: ${sizeSprite}px;`;
      sprite.style.top = `${y}px`;
      sprite.style.left = `${x}px`;
      sprite.style.backgroundImage = 'url(./assets/img/sprite__bat.gif)';
      sprite.style.cssText += 'background-size: cover; background-position: center;';
      document.body.appendChild(sprite);
   }
}

function gerarMoedas(num = 0)
{
   for (let i = 0; i < num; i++)
   {
      const moeda = document.createElement('div');
      const [x, y] = getPos('moeda');

      moeda.style.position = 'absolute';
      moeda.classList.add('moeda');
      moeda.style.cssText += getSize(sizeMoeda, sizeMoeda);
      moeda.style.top = `${y}px`;
      moeda.style.left = `${x}px`;
      moeda.style.backgroundImage = 'url(./assets/img/moeda.gif)';
      moeda.style.cssText += 'background-size: cover; background-position: center;';
      document.body.appendChild(moeda);
   }
}

function carregarCharacter()
{
   const personagem = document.createElement('div');
   personagem.classList.add('personagem');
   personagem.style.position = 'absolute';
   personagem.style.left = `calc(50% - ${charW / 2}px)`;
   personagem.style.top = `calc(50% - ${charH / 2}px)`;
   personagem.style.cssText += getSize(charW, charH);
   personagem.style.backgroundImage = 'url(./assets/img/character/2.png)';
   document.body.appendChild(personagem);

   const sword = document.createElement('div');
   sword.classList.add('sword');
   sword.style.position = 'absolute';
   sword.style.left = `calc(50% - ${(swordW / 2) - 25}px)`;
   sword.style.top = `calc(50% - ${(swordH / 2) - 15}px)`;
   sword.style.cssText += getSize(swordW, swordH);
   sword.style.backgroundImage = 'url(./assets/img/sword.png)';
   sword.style.backgroundPosition = 'center';
   sword.style.backgroundSize = 'cover';
   personagem.appendChild(sword);
}

// TODO: carrega o personagem, sprites e as moedas
carregarCharacter();
gerarSprites(nSprite);
gerarMoedas(nMoedas);

document.addEventListener('keydown', (event) => 
{
   const person = document.querySelector('.personagem');
   const sword = document.querySelector('.sword');

   if (event.key === 'ArrowRight' && (posX + charW + passo) <= maxX && !fimDeJogo && ataque) 
      movimentaPersonagem('right', person, '4.png', frame);

   if (event.key === 'ArrowLeft' && (posX - passo) >= minX && !fimDeJogo && ataque)
      movimentaPersonagem('left', person, '3.png', frame);

   if (event.key === 'ArrowUp' && (posY - passo) >= minY && !fimDeJogo && ataque)
      movimentaPersonagem('up', person, '1.png', frame);

   if (event.key === 'ArrowDown' && (posY + charH + passo) <= maxY && !fimDeJogo && ataque)
      movimentaPersonagem('down', person, '2.png', frame);

   if (event.code === 'Space' && ataque && !fimDeJogo)
      atack(sword);
});

function finalizar(verif1 = false, verif2 = false)
{
   fimDeJogo = true; // ! Desabilita os controles
   if (verif1) clearInterval(verif1); // ? Disabilita a verificação de colisão com os sprites
   if (verif2) clearInterval(verif2); // ? Desabilita a verificação de colisão com as moedas
   alert('Parabéns! Você venceu!\n\nMoedas: ' + pontos + '\nMortos: ' + mortos);
}

// TODO: Interações com Sprites
colisaoSprite = setInterval(() =>
{
   let personagem = document.querySelector('.personagem');

   document.querySelectorAll('.sprite').forEach(sprite =>
   {
      if (colisao(sprite, personagem, 18) && !sprite.classList.contains('death'))
      {
         personagem.classList.add('death');
         fimDeJogo = true; // ! Desabilita os controles
         document.body.style.cssText += 'background: #000; filter: invert(100%) grayscale(100%)';
         setTimeout(() => alert('Você foi morto!'), 500);
         clearInterval(colisaoSprite);
      }
   });
}, 100);

// TODO: Interações com Moedas
colisaoMoeda = setInterval(() =>
{
   document.querySelectorAll('.moeda').forEach((moeda) =>
   {
      if (colisao(moeda, document.querySelector('.personagem'), 8))
      {
         moeda.remove(); // Remove a moeda coletada
         atualizaScore(++pontos); // Incrementa o numero de moedas obtidas

         if (mortos === nSprite)
            finalizar(colisaoSprite, colisaoMoeda);
      }
   });
}, 100);