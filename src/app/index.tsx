// Importa o ícone FontAwesome do pacote de ícones do Expo
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
// Importa o React para criar componentes
import React, { useEffect, useRef, useState } from 'react';
// Importa componentes e utilitários do React Native
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// Obtém a largura da tela do dispositivo
const { width } = Dimensions.get('window'); // Usado para definir largura das imagens do carrossel

const colors = {
  //variaveis de cores
  branco: '#ffffff', 
  rosa: '#ff0080',   
  gelo: '#f1f1f1',   
  preto: '#2a2a2a',  
};
//carrosel com as imagens
const carouselImages = [
  require('../../assets/images/brigadeiro_de_formatura.png'),
  require('../../assets/images/brigadeiro_natalino.png'),
  require('../../assets/images/brigadeiros_coloridos.png'),
  require('../../assets/images/amor.png'),
  require('../../assets/images/combo.png'),
  require('../../assets/images/coracao_de_brigadeiro.png'),
  require('../../assets/images/cha.png'),
];

// Lista de produtos
const produtos = [
  {
    nome: 'coração de brigadeiro',
    preco: 'R$ 25,00',
    img: require('../../assets/images/foto sem fundo do coracao.png'),
  },
  {
    nome: 'Prato de Brigadeiro',
    preco: 'R$ 40,00',
    img: require('../../assets/images/venda sem fundo do prato.png'),
  },

  {
    nome: 'Caixa de Brigadeiros',
    preco: 'R$ 30,00',
    img: require('../../assets/images/caixa_de_brigadeiros.png'),
  },

 {
    nome: 'Brigadeiros Natalinos',
    preco: 'R$ 50,00',
    img: require('../../assets/images/combo natalino.png'),
  },

   
 
];

export default function Index() {
  const carouselRef = useRef<ScrollView>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Para a rolagem automática
  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Inicia a rolagem automática
  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      setCarouselIndex(prev => {
        const next = prev + 1 < carouselImages.length ? prev + 1 : 0;
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ x: next * width * 0.9, animated: true });
        }
        return next;
      });
    }, 3000);
  };

  React.useEffect(() => {
    startAutoScroll();
    return () => {
      stopAutoScroll();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Petit Brigaderia</Text>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarWrapper}>
            <TextInput
              style={styles.searchBar}
              placeholder="o que voce procura?"
              placeholderTextColor="#b3afaf"
            />
            <FontAwesome name="search" size={22} color={colors.preto} style={styles.searchIcon} />
          </View>
        </View>
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselRow}
            onScrollBeginDrag={stopAutoScroll}
            onScrollEndDrag={startAutoScroll}
            onTouchStart={stopAutoScroll}
            onTouchEnd={startAutoScroll}
          >
            {carouselImages.map((img, idx) => (
              <Image key={idx} source={img} style={styles.carouselImage} />
            ))}
          </ScrollView>
        </View>
        <View style={styles.saboresRow}>
          <Text style={styles.saboresText}>Sabores</Text>
          <View style={styles.verTodosContainer}>
            <Text style={styles.verTodosText}>ver todos os sabores</Text>
            <Feather name="arrow-right" size={22} color={colors.rosa} />
          </View>
        </View>
        <View style={styles.saboresCarrosselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.saboresCarrosselRow}
          >
            {['Brigadeiro', 'Beijinho', 'Coco', 'Morango', 'Paçoca', 'Ovomaltine', 'Nutella'].map((sabor, idx) => (
              <View key={idx} style={styles.saborButton}>
                <Text style={styles.saborButtonText}>{sabor}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.produtosContainer}>
          {produtos.map((produto, idx) => (
            <View key={idx} style={styles.produtoCard}>
              <Image source={produto.img} style={styles.produtoImg} />
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              <Text style={styles.produtoPreco}>{produto.preco}</Text>
            </View>
          ))}
        </View>
        {/* Botão de compras dentro do ScrollView */}
        <View style={styles.shoppingButton}>
          <MaterialIcons name="shopping-cart" size={30} color={colors.rosa} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  //estilo do container de fotos
  fotosContainer: {
    marginTop: 10,
    marginBottom: 10,//
  },
  //configuraçao da linha de fotos
  fotosRow: {
    flexDirection: 'row',//
    alignItems: 'center',//
    paddingHorizontal: 5,
  },
  //estilo de cada foto
  fotoItem: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginRight: 12,
    resizeMode: 'cover',
    backgroundColor: colors.gelo,
  },
  //estilo do carrossel de sabores
  saboresCarrosselContainer: {
    marginTop: 20,//espaçamento entre a linha sabores e o carrossel de sabores
    marginBottom: 10,//espaçamento entre o carrossel de sabores e o conteudo abaixo
  },
  //configuraçao do carrossel de sabores
  saboresCarrosselRow: {
    flexDirection: 'row',//alinha as imagens em uma linha
    alignItems: 'center',//alinha os itens verticalmente ao centro
    paddingHorizontal: 5,//espaçamento da direita e esquerda
  },
  //estilo dos botões de sabores
  saborButton: {
    borderWidth: 1,//largura da borda
    backgroundColor: colors.gelo,//cor de fundo
    borderRadius: 20,//bordas arredondadas
    paddingVertical: 10,//espaçamento interno vertical
    paddingHorizontal: 20,//espaçamento interno horizontal
    marginRight: 15,//espaçamento entre os botões
    elevation: 0,//elevação para sombra no Android
  },
  //estilo do texto dos botões de sabores
  saborButtonText: {
    color: colors.rosa,//cor do texto
    fontWeight: 'bold',
    fontSize: 15,
  },
  //estilo da linha sabores
  saboresRow: {
    flexDirection: 'row',//alinha os itens em uma linha
    justifyContent: 'space-between',//espaço entre sabores e ver todos
    marginTop: 0,//espaçamento entre o carrossel e a linha sabores
    marginBottom: 0,//espaçamento entre a linha sabores e o conteudo abaixo
    paddingHorizontal: 0,//espaçamento nas laterais
  },
  //estilo do ver todos os sabores
  verTodosContainer: {
    flexDirection: 'row',//alinha os itens em uma linha
    alignItems: 'center',//alinha verticalmente ao centro
    marginRight: 5,//ajuste de posiçao
  },
  //estilo do texto ver todos os sabores
  verTodosText: {
    color: colors.rosa,//cor do texto
    fontSize: 15,//tamanho da fonte
    marginRight: 2,//espaçamento entre o texto e o ícone
    borderColor: colors.rosa,//cor da borda
  },
  //estilo do botao de compras
  shoppingButton: {
  position: 'absolute',
  top: 30,
  right: 25,
  zIndex: 10,
  backgroundColor: colors.branco,
  borderRadius: 20,
  padding: 6,
  elevation: 3,
  color: colors.rosa,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  flexDirection: 'row',
  alignItems: 'center',
  },
  container: { backgroundColor: colors.branco, padding: 20 },
  title: {
    //configuraçao do titulo
    fontSize: 28, //tamanho da fonte
    fontWeight: 'bold', //negrito
    color: colors.rosa,//cor do titulo
    marginLeft: -10,//ajuste de posiçao de direita para esquerda
    marginTop: 15,//ajuste de altura
    marginBottom: 15,//espaçamento entre o titulo e o carrossel
  },
  searchBarContainer: {
    //configuraçao da barra de pesquisa
    alignItems: 'center',
    marginBottom: 20, // espaçamento entre a barra de pesquisa e o carrossel
  },
  //posicionamento da barra de pesquisa
  searchBarWrapper: {
    position: 'relative',
    width: '100%', // largura da barra de pesquisa
    justifyContent: 'center',
  },
  searchBar: {
    //aparencia do campo de pesquisa
    width: '100%',
    height: 40,//altura da barra de pesquisa
    borderColor: colors.preto,//cor da borda
    borderWidth: 1,//largura da borda
    borderRadius: 20,//borda arredondada
    paddingHorizontal: 12,//espaçamento interno do texto
    fontSize: 16,//tamanho da fonte
    backgroundColor: colors.branco,//cor de fundo
    color: colors.preto,//cor do texto digitado
  },


  //posição do ícone de pesquisa
  searchIcon: {
    position: 'absolute',//posição absoluta dentro do campo de pesquisa
    right: 15,//distancia da direita
    top: '50%',//centralizado verticalmente
    transform: [{ translateY: -11 }],//ajuste fino para centralizar
    zIndex: 1,//garante que o ícone fique acima do campo de texto
  },


  carouselContainer: {
    marginBottom: 10, // controla a distância para o texto "Sabores"
  },
  //configuraçao do carrossel
  carouselRow: {
    paddingHorizontal: 0,//espaçamento da direita e esquerda
    flexDirection: 'row',//alinha as imagens em uma linha
  },
  //estilo das imagens do carrossel
  carouselImage: {
    width: width * 0.9,//largura da imagem (90% da largura da tela)
    height: 250,//altura da imagem
    resizeMode: 'center',//cobre toda a área da imagem
    borderRadius: 20,//bordas arredondadas
    marginRight: 0,//espaçamento entre as imagens
  },
  //configuraçao do texto Sabores
  saboresText: {
    fontSize: 22,//tamanho da fonte
    fontWeight: 'bold',//negrito
    marginLeft: 5,//ajuste de posiçao
    marginTop: 1, // já vai colado no carrossel
  },
  //estilo da lista de produtos
  produtosContainer: {
    marginTop: 10,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  //estilo do card de cada produto
  produtoCard: {
    backgroundColor: colors.gelo,//cor de fundo do card
    borderRadius: 18,//bordas arredondadas
    padding: 12,//espaçamento interno
    alignItems: 'center',//alinha o conteudo ao centro
    width: 150,//largura do card
    margin: 17,//espaçamento entre os cards
    elevation: 2,//elevação para sombra no Android
  },
  //estilo da imagem do produto
  produtoImg: {
    width: 90,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  //estilo do nome do produto
  produtoNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.preto,
    marginBottom: 4,
    textAlign: 'center',
  },
  //estilo do preço do produto
  produtoPreco: {
    fontSize: 14,
    color: colors.rosa,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
