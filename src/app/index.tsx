// ...existing code...
// ===================== IMPORTS =====================
import { Feather, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, VStack, HStack, Avatar, Heading, Button, Divider, Text as NBText, Input } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===================== CONSTANTES =====================
const { width } = Dimensions.get('window'); // Largura da tela
const colors = {
  branco: '#ffffff',
  rosa: '#ff0080',
  gelo: '#f1f1f1',
  preto: '#2a2a2a',
};
const carouselImages = [
  require('../../assets/images/brigadeiro_de_formatura.png'),
  require('../../assets/images/brigadeiro_natalino.png'),
  require('../../assets/images/brigadeiros_coloridos.png'),
  require('../../assets/images/amor.png'),
  require('../../assets/images/combo.png'),
  require('../../assets/images/coracao_de_brigadeiro.png'), 
  require('../../assets/images/cha.png'),
  
];
const produtos = [
  { nome: 'Coração de Brigadeiro', preco: 'R$ 35,00', img: require('../../assets/images/coracao_de_brigadeiro_home.png') },
  { nome: 'Bandeja de Brigadeiro', preco: 'R$ 40,00', img: require('../../assets/images/bandeja_brigadeiro.png') },
  { nome: 'Caixa de Brigadeiros', preco: 'R$ 30,00', img: require('../../assets/images/caixa_brigadeiro_home.png') },
  { nome: 'Brigadeiros Fit', preco: 'R$ 40,00', img: require('../../assets/images/brigadeiro_fit_home.png') },
  { nome: 'Brigadeiros Casal', preco: 'R$ 35,00', img: require('../../assets/images/brigadeiro_casal_home.png') },
  { nome: 'Brigadeiros Degustação', preco: 'R$ 10,00', img: require('../../assets/images/brigadeiro_degustaçao_home.png') },
  { nome: 'Bolo de Abacaxi', preco: 'R$ 15,00', img: require('../../assets/images/bolo_abacaxi.png') },
  { nome: 'Bolo de Ninho', preco: 'R$ 15,00', img: require('../../assets/images/bolo_ninho_home.png') },
  { nome: 'Bolo de Chocolate', preco: 'R$ 15,00', img: require('../../assets/images/bolo_chocolate.png') },
  { nome: 'Bolo de Limão', preco: 'R$ 15,00', img: require('../../assets/images/bolo_limao.png') },
  
];

// ===================== TIPOS =====================
interface IndexProps {
  setUserToken?: (token: string | null) => void;
}

// ===================== COMPONENTE PRINCIPAL =====================
export default function Index({ setUserToken }: IndexProps) {
  // Estado do carrinho de compras
  const [carrinho, setCarrinho] = useState<any[]>([]);
  // Estado da aba ativa
  // Removido: já existe declaração de activeTab/setActiveTab mais abaixo

  // Página Carrinho (estilizada com NativeBase)
  const CarrinhoPage = React.memo(() => {
    const [numeroCasa, setNumeroCasa] = React.useState('');
    const [bairro, setBairro] = React.useState('');
    const [referencia, setReferencia] = React.useState('');
    // Estado para modal de endereço
    const [modalEnderecoVisible, setModalEnderecoVisible] = React.useState(false);
    // Inicializa vazio e sincroniza com userData quando disponível para evitar dependência direta
    const [enderecoEntrega, setEnderecoEntrega] = React.useState('');

    React.useEffect(() => {
      setEnderecoEntrega(userData?.endereco || '');
    }, [userData]);
    // Chave Pix fictícia
    const chavePix = 'petitbrigaderia@pix.com';
    const [modalPagamentoVisible, setModalPagamentoVisible] = React.useState(false);
    const [formaPagamento, setFormaPagamento] = React.useState<string | null>(null);

    // Função local para remover item do carrinho
    const handleRemoverItem = (idx: number) => {
      setCarrinho(prev => prev.filter((_, i) => i !== idx));
    };

    // Função para calcular o total do carrinho
    const calcularTotal = () => {
      return carrinho.reduce((acc, item) => {
        const preco = parseFloat(String(item.preco).replace('R$', '').replace(',', '.').trim() || '0');
        return acc + (isNaN(preco) ? 0 : preco);
      }, 0);
    };

    // Função para confirmar compra
    const handleConfirmarCompra = () => {
      if (carrinho.length === 0) return;
      setModalEnderecoVisible(true);
    };

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fbf7fb' }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
        <Box>
          <HStack justifyContent="space-between" alignItems="center" mb={4}>
            <Heading size="lg" color={colors.rosa}>Carrinho</Heading>
          </HStack>

          {carrinho.length === 0 ? (
            <Box bg={colors.branco} borderRadius={18} p={6} alignItems="center" shadow={2}>
              <Avatar size={90} bg="pink.50" mb={3}>
                <FontAwesome name="shopping-cart" size={36} color={colors.rosa} />
              </Avatar>
              <NBText color={colors.preto} fontSize="lg" fontWeight="bold">Seu carrinho está vazio.</NBText>
              
            </Box>
          ) : (
            <VStack space={4}>
              <VStack space={3}>
                {carrinho.map((item, idx) => (
                  <Box key={idx} bg={colors.branco} p={4} borderRadius={14} shadow={1}>
                    <HStack alignItems="center" space={3}>
                      <Image source={item.img} style={{ width: 64, height: 64, borderRadius: 12, borderWidth: 1, borderColor: colors.gelo }} />
                      <VStack flex={1}>
                        <NBText fontWeight="bold" fontSize="md" color={colors.preto}>{item.nome}</NBText>
                        <NBText color={colors.rosa} fontWeight="bold">{item.preco}</NBText>
                      </VStack>
                      <VStack alignItems="flex-end" space={2}>
                        <NBText color={colors.preto} fontSize="sm">Qtd: {item.quantidade ?? 1}</NBText>
                        <Button size="sm" bg={colors.rosa} borderRadius={10} onPress={() => handleRemoverItem(idx)} leftIcon={<FontAwesome name="trash" size={14} color={colors.branco} />}>Remover</Button>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>

              <Box bg={colors.branco} p={4} borderRadius={18} shadow={1} alignItems="center">
                <HStack justifyContent="space-between" width="100%">
                  <NBText fontSize="md" color={colors.preto} fontWeight="bold">Total</NBText>
                  <NBText fontSize="lg" color={colors.rosa} fontWeight="bold">R$ {calcularTotal().toFixed(2).replace('.',',')}</NBText>
                </HStack>
                <Button mt={4} bg={colors.rosa} borderRadius={14} width="100%" onPress={handleConfirmarCompra}><NBText color={colors.branco} fontWeight="bold">Finalizar compra</NBText></Button>
              </Box>

              {/* Modal de confirmação/edição de endereço */}
              <Modal visible={modalEnderecoVisible} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                  <Box bg={colors.gelo} borderRadius={18} p={6} alignItems="center" width={320}>
                    <NBText fontSize="lg" fontWeight="bold" color={colors.rosa} mb={4}>Endereço de entrega</NBText>
                    <TextInput
                      placeholder="Endereço (Rua, Avenida...)"
                      value={enderecoEntrega}
                      onChangeText={setEnderecoEntrega}
                      style={{ width: '100%', height: 44, borderColor: colors.rosa, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, backgroundColor: colors.branco, color: colors.preto, marginBottom: 12 }}
                    />
                    <HStack space={3} width="100%">
                      <TextInput
                        placeholder="Nº"
                        value={numeroCasa}
                        onChangeText={setNumeroCasa}
                        style={{ flex: 1, height: 44, borderColor: colors.rosa, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, backgroundColor: colors.branco, color: colors.preto }}
                      />
                      <TextInput
                        placeholder="Bairro"
                        value={bairro}
                        onChangeText={setBairro}
                        style={{ flex: 2, height: 44, borderColor: colors.rosa, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, backgroundColor: colors.branco, color: colors.preto }}
                      />
                    </HStack>
                    <TextInput
                      placeholder="Referência"
                      value={referencia}
                      onChangeText={setReferencia}
                      style={{ width: '100%', height: 44, borderColor: colors.rosa, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, backgroundColor: colors.branco, color: colors.preto, marginTop: 12, marginBottom: 12 }}
                    />
                    <HStack space={3} width="100%">
                      <Button flex={1} bg={colors.rosa} borderRadius={10} onPress={() => { setModalEnderecoVisible(false); setModalPagamentoVisible(true); }}>Confirmar</Button>
                      <Button flex={1} bg={colors.preto} borderRadius={10} onPress={() => setModalEnderecoVisible(false)}>Cancelar</Button>
                    </HStack>
                  </Box>
                </View>
              </Modal>

              {/* Modal de forma de pagamento */}
              <Modal visible={modalPagamentoVisible} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                  <Box bg={colors.gelo} borderRadius={18} p={6} alignItems="center" width={320}>
                    <NBText fontSize="lg" fontWeight="bold" color={colors.rosa} mb={4}>Forma de pagamento</NBText>
                    {['Pix', 'Dinheiro', 'Crédito'].map(opcao => (
                      <Button key={opcao} variant={formaPagamento === opcao ? 'solid' : 'outline'} colorScheme="pink" borderRadius={12} width="100%" mb={3} onPress={() => setFormaPagamento(opcao)}>
                        <NBText color={formaPagamento === opcao ? colors.branco : colors.rosa} fontWeight="bold">{opcao}</NBText>
                      </Button>
                    ))}
                    {formaPagamento === 'Pix' && (
                      <VStack mt={2} mb={2} alignItems="center">
                        <NBText fontSize="sm" color={colors.preto}>Chave Pix:</NBText>
                        <NBText fontWeight="bold" color={colors.rosa}>{chavePix}</NBText>
                        <NBText>Valor: R$ {calcularTotal().toFixed(2).replace('.', ',')}</NBText>
                      </VStack>
                    )}
                    <Button bg={colors.rosa} borderRadius={12} width="100%" onPress={() => {
                      if (formaPagamento) {
                        setModalPagamentoVisible(false);
                        setCarrinho([]);
                        if (formaPagamento === 'Pix') {
                          Alert.alert('Compra confirmada!', `Forma de pagamento: Pix\nChave Pix: ${chavePix}\nValor: R$ ${calcularTotal().toFixed(2).replace('.', ',')}`);
                        } else {
                          Alert.alert('Compra confirmada!', 'Forma de pagamento: ' + formaPagamento);
                        }
                        setFormaPagamento(null);
                      } else {
                        Alert.alert('Selecione uma forma de pagamento.');
                      }
                    }}>
                      <NBText color={colors.branco} fontWeight="bold">Confirmar</NBText>
                    </Button>
                  </Box>
                </View>
              </Modal>
            </VStack>
          )}
        </Box>
      </ScrollView>
    );
  });

  // HomePage memoizado e com auto scroll local
  const HomePage = React.memo(() => {
  // Estado para modal de zoom do produto
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomProduto, setZoomProduto] = useState<{img: any, nome: string, preco: string} | null>(null);
    // Função para remover item do carrinho
    const handleRemoverItem = (idx: number) => {
      setCarrinho(prev => prev.filter((_, i) => i !== idx));
    };
  // Array de refs para os cards dos produtos
  const produtoRefs = useRef(produtos.map(() => React.createRef<View>())).current;

  // Ref para o carrinho
  const carrinhoRef = useRef<View>(null);
  // Estado do modal do carrinho
  const [showCarrinhoModal, setShowCarrinhoModal] = useState(false);
    const carouselRef = useRef<ScrollView>(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
      intervalRef.current = setInterval(() => {
        setCarouselIndex(prev => {
          const next = prev + 1 < carouselImages.length ? prev + 1 : 0;
          if (carouselRef.current) {
            carouselRef.current.scrollTo({ x: next * width * 0.9, animated: true });
          }
          return next;
        });
      }, 3000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, []);

    // Adiciona produto ao carrinho sem animação
    const handleComparar = (produto: any) => {
      setCarrinho(prev => [...prev, produto]);
      Alert.alert('Produto adicionado ao carrinho!', `${produto.nome} foi adicionado para comparação.`);
    };

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff6fa' }} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Heading size="xl" color={colors.rosa} textAlign="center" mb={4}>Petit Brigaderia</Heading>

        <Box alignItems="center" mb={6}>
          <Box style={{ position: 'relative', width: '100%' }}>
            <TextInput
              style={{ width: '100%', height: 44, borderRadius: 25, paddingHorizontal: 16, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, elevation: 4, shadowColor: colors.rosa, shadowOpacity: 0.15, shadowRadius: 5  }}
              placeholder="O que você procura?"
              placeholderTextColor="#b3afaf"
            />
            <FontAwesome name="search" size={22} color={colors.rosa} style={{ position: 'absolute', right: 18, top: '50%', transform: [{ translateY: -11 }], zIndex: 1 }} />
          </Box>
        </Box>

        {/* Mantive o carrossel exatamente como estava para não alterar as bordas */}
        <Box mb={4} bg="#fff6fa" borderRadius={20}>
          <ScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 0 }}
          >
            {carouselImages.map((img, idx) => (
              <View key={idx} style={{ width: width * 0.9, height: 230, borderRadius: 80, overflow: 'hidden', marginRight: 0, backgroundColor: '#fff6fa', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={img} style={{ width: '100%', position: 'absolute', height: '100%', resizeMode: 'cover', borderRadius: 40, backgroundColor: '#fff6fa' }} />
              </View>
            ))}
          </ScrollView>
        </Box>

        <Box mt={4} mb={4} >
          <HStack justifyContent="space-between" alignItems="center" mb={3}>
            <Heading size="xl" color={colors.rosa} textAlign="left" letterSpacing={1}>Produtos em destaque</Heading>
          </HStack>

          <VStack space={4}>
            <HStack flexWrap="wrap" justifyContent="space-between">
              {produtos.map((produto, idx) => (
                <Box
                  key={idx}
                  ref={produtoRefs[idx]}
                  bg={colors.gelo}
                  borderRadius={28}
                  p={4}
                  width="48%"
                  mb={6}
                  style={{ minHeight: 260, justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 }}
                >
                  <TouchableOpacity activeOpacity={0.8} onPress={() => { setZoomProduto(produto); setZoomVisible(true); }}>
                    <Image source={produto.img} style={{ width: 120, height: 130, borderRadius: 18, marginBottom: 10, resizeMode: 'cover', borderWidth: 2, borderColor: colors.rosa, backgroundColor: colors.gelo, shadowColor: colors.rosa, shadowOpacity: 0.15, shadowRadius: 8 }} />
                  </TouchableOpacity>
                  <NBText fontSize="15" fontWeight="bold" color={colors.preto} textAlign="center">{produto.nome}</NBText>
                  <NBText fontSize="20" color={colors.rosa} fontWeight="700" textAlign="center" mb={2}>{produto.preco}</NBText>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.rosa,
                      borderRadius: 18,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      marginTop: 8,
                      alignSelf: 'center',
                      elevation: 4,
                    }}
                    onPress={() => handleComparar(produto)}
                  >
                    <Text style={{ color: colors.branco, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 }}>
                      Comprar
                    </Text>
                  </TouchableOpacity>
                </Box>
              ))}
            </HStack>
          </VStack>
        </Box>

        {/* Modal de zoom do produto */}
        <Modal visible={zoomVisible && !!zoomProduto} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: colors.branco, borderRadius: 30, padding: 18, alignItems: 'center', width: '85%' }}>
              {zoomProduto?.img && (
                <Image source={zoomProduto.img} style={{ width: 260, height: 260, borderRadius: 22, marginBottom: 18, resizeMode: 'contain', backgroundColor: colors.branco, borderWidth: 3, borderColor: colors.rosa }} />
              )}
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.rosa, marginBottom: 8, textAlign: 'center' }}>{zoomProduto?.nome}</Text>
              <Text style={{ fontSize: 18, color: colors.preto, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>{zoomProduto?.preco}</Text>
              <TouchableOpacity style={{ marginTop: 8, backgroundColor: colors.rosa, borderRadius: 18, paddingVertical: 10, paddingHorizontal: 32 }} onPress={() => setZoomVisible(false)}>
                <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  });

  const EncomendasPage: React.FC<{ carrinho: any[], setCarrinho: React.Dispatch<any>, setActiveTab: React.Dispatch<React.SetStateAction<'home' | 'encomenda' | 'perfil' | 'carrinho'>> }> = ({ carrinho, setCarrinho, setActiveTab }) => {
  // Estado para modal de compra individual
  const [modalComprarIdx, setModalComprarIdx] = useState<number | null>(null);
  const [quantidadeComprar, setQuantidadeComprar] = useState('');
  // Estado para modal de zoom do produto
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomProduto, setZoomProduto] = useState<{img: any, nome: string} | null>(null);
  // Chave Pix fictícia
  const chavePix = 'petitbrigaderia@pix.com';
  const [modalPagamentoVisible, setModalPagamentoVisible] = React.useState(false);
  const [formaPagamento, setFormaPagamento] = React.useState<string | null>(null);
  const produtosEncomenda = [
      { nome: 'Brigadeiro 50% cacau', img: require('../../assets/images/brigadeiro encomenda.jpg') },
      { nome: 'Brigadeiro com castanha', img: require('../../assets/images/brigadeiro com castanha.jpg') },
      { nome: 'Beijinho', img: require('../../assets/images/beijinho.png') },
      { nome: 'Ninho com Nutella', img: require('../../assets/images/Ninho com nutella.png') },
      { nome: 'Castanha', img: require('../../assets/images/castanha.png') },
      { nome: 'Doce de leite', img: require('../../assets/images/Doce de liete.png') },
      { nome: 'Casadinho', img: require('../../assets/images/Casadinho.png') },
      { nome: 'Chocolate branco', img: require('../../assets/images/chocolate branco.png') },
      { nome: 'Chocolate com flocos de arroz', img: require('../../assets/images/Chocolate com flocos de arroz.png') },
      { nome: 'Farinha láctea', img: require('../../assets/images/farinha láctea.png') },
    ];
  const [quantidades, setQuantidades] = React.useState<number[]>(Array(produtosEncomenda.length).fill(0));

  // Persistência das quantidades
  React.useEffect(() => {
    (async () => {
      const salvo = await AsyncStorage.getItem('quantidadesEncomenda');
      if (salvo) {
        try {
          const arr = JSON.parse(salvo);
          if (Array.isArray(arr) && arr.length === produtosEncomenda.length) {
            setQuantidades(arr);
          }
        } catch {}
      }
    })();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem('quantidadesEncomenda', JSON.stringify(quantidades));
  }, [quantidades]);

  const alterarQuantidadeDireta = (idx: number, valor: string) => {
    const num = Math.max(0, parseInt(valor) || 0);
    setQuantidades(qs => {
      const novo = [...qs];
      novo[idx] = num;
      return novo;
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fbf7fb' }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
      <Box>
        <HStack justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="lg" color={colors.rosa}>Encomendas</Heading>
        </HStack>

        <VStack space={3}>
          {produtosEncomenda.map((produto, idx) => (
            <Box key={idx} bg={colors.branco} p={4} borderRadius={14} shadow={1}>
              <HStack alignItems="center" space={3}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { setZoomProduto(produto); setZoomVisible(true); }}>
                  <Image source={produto.img} style={{ width: 64, height: 64, borderRadius: 12, marginRight: 8, backgroundColor: colors.gelo, borderWidth: 1, borderColor: colors.rosa }} />
                </TouchableOpacity>
                <VStack flex={1}>
                          <NBText fontWeight="bold" fontSize="md" color={colors.preto}>{produto.nome}</NBText>
                </VStack>
                <VStack alignItems="flex-end" space={2}>
                  <Button size="sm" bg={colors.rosa} borderRadius={20} onPress={() => { setModalComprarIdx(idx); setQuantidadeComprar(quantidades[idx] === 0 ? '' : String(quantidades[idx])); }}>
                    <NBText color={colors.branco} fontWeight="bold">Comprar</NBText>
                  </Button>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>

        {/* Modal para informar quantidade ao comprar */}
        {modalComprarIdx !== null && (
          <Modal visible={true} transparent animationType="fade" onRequestClose={() => setModalComprarIdx(null)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
              <Box bg={colors.gelo} borderRadius={18} p={6} width={320} alignItems="center">
                <NBText fontSize="lg" fontWeight="bold" color={colors.rosa} mb={3}>Informe a quantidade</NBText>
                <TextInput
                  style={{ width: 100, height: 44, backgroundColor: colors.branco, borderRadius: 10, borderWidth: 1, borderColor: colors.rosa, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: colors.rosa, marginBottom: 12 }}
                  keyboardType="numeric"
                  value={quantidadeComprar}
                  onChangeText={setQuantidadeComprar}
                  placeholder="Qtd."
                  placeholderTextColor={colors.rosa}
                  maxLength={4}
                  autoFocus
                />
                <NBText fontSize="md" color={colors.rosa} fontWeight="bold" mb={4}>Total: R$ {(Math.max(0, parseInt(quantidadeComprar) || 0) * 2).toFixed(2).replace('.', ',')}</NBText>
                <HStack space={3} width="100%">
                  <Button flex={1} bg={colors.rosa} borderRadius={20} onPress={() => {
                    const num = Math.max(0, parseInt(quantidadeComprar) || 0);
                    if (num > 0 && modalComprarIdx !== null) {
                      setCarrinho((prev: any[]) => [
                        ...(prev ?? []),
                        { ...produtosEncomenda[modalComprarIdx], quantidade: num, preco: `R$ ${(num * 2).toFixed(2).replace('.', ',')}` }
                      ]);
                      Alert.alert('Produto adicionado ao carrinho!', `${produtosEncomenda[modalComprarIdx].nome} (${num} unidade${num > 1 ? 's' : ''}) foi adicionado ao carrinho.`);
                    }
                    setQuantidades(qs => {
                      const novo = [...qs];
                      if (modalComprarIdx !== null) novo[modalComprarIdx] = Math.max(0, parseInt(quantidadeComprar) || 0);
                      setTimeout(() => {
                        if (modalComprarIdx !== null) {
                          const reset = [...novo];
                          reset[modalComprarIdx] = 0;
                          setQuantidades(reset);
                        }
                      }, 300);
                      return novo;
                    });
                    setModalComprarIdx(null);
                  }}> 
                    <NBText color={colors.branco} fontWeight="bold">Confirmar</NBText>
                  </Button>
                  <Button flex={1} bg={colors.preto} borderRadius={20} onPress={() => setModalComprarIdx(null)}>
                    <NBText color={colors.branco} fontWeight="bold">Cancelar</NBText>
                  </Button>
                </HStack>
              </Box>
            </View>
          </Modal>
        )}

        {/* Modal de zoom do produto */}
        <Modal visible={zoomVisible && !!zoomProduto} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <Box bg={colors.branco} borderRadius={30} p={6} alignItems="center" width="85%">
              {zoomProduto?.img && (
                <Image source={zoomProduto.img} style={{ width: 220, height: 220, borderRadius: 18, marginBottom: 18, resizeMode: 'contain', backgroundColor: colors.branco, borderWidth: 2, borderColor: colors.rosa }} />
              )}
              <NBText fontSize="lg" fontWeight="bold" color={colors.rosa} mb={3} textAlign="center">{zoomProduto?.nome}</NBText>
              <Button bg={colors.rosa} borderRadius={20} onPress={() => setZoomVisible(false)}>
                <NBText color={colors.branco} fontWeight="bold">Fechar</NBText>
              </Button>
            </Box>
          </View>
        </Modal>

        {/* Modal de pagamento semelhante ao original, estilizado com NativeBase */}
        <Modal visible={modalPagamentoVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <Box bg={colors.gelo} borderRadius={18} p={6} width={320} alignItems="center">
              <NBText fontSize="lg" fontWeight="bold" color={colors.rosa} mb={4}>Escolha a forma de pagamento:</NBText>
              {['Pix', 'Dinheiro', 'Crédito'].map(opcao => (
                <Button key={opcao} variant={formaPagamento === opcao ? 'solid' : 'outline'} colorScheme="pink" borderRadius={20} width="100%" mb={3} onPress={() => setFormaPagamento(opcao)}>
                  <NBText color={formaPagamento === opcao ? colors.branco : colors.rosa} fontWeight="bold">{opcao}</NBText>
                </Button>
              ))}
              <Button bg={colors.rosa} borderRadius={20} width="100%" onPress={() => {
                if (formaPagamento) {
                  const novosItens = produtosEncomenda
                    .map((produto, idx) => ({ ...produto, preco: `R$ ${(quantidades[idx] * 2).toFixed(2).replace('.', ',')}`, quantidade: quantidades[idx] }))
                    .filter(item => item.quantidade > 0);
                  novosItens.forEach(item => setCarrinho((prev: any[]) => [...prev, item]));
                  if (novosItens.length > 0) setActiveTab('carrinho');
                  setModalPagamentoVisible(false);
                  setQuantidades(Array(produtosEncomenda.length).fill(0));
                  AsyncStorage.setItem('quantidadesEncomenda', JSON.stringify(Array(produtosEncomenda.length).fill(0)));
                  setFormaPagamento(null);
                } else {
                  Alert.alert('Selecione uma forma de pagamento.');
                }
              }}>
                <NBText color={colors.branco} fontWeight="bold">Confirmar</NBText>
              </Button>
            </Box>
          </View>
        </Modal>
      </Box>
    </ScrollView>
  );
  };

  const PerfilPage = ({ clearAsyncStorage, userData, handleDeleteAccount, handleChangePassword }: {
    clearAsyncStorage: () => void,
    userData: any,
    handleDeleteAccount: () => void,
    handleChangePassword: () => void,
  }) => {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fbf7fb' }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
        <Box>
          <HStack justifyContent="space-between" alignItems="center" mb={6}>
            <Heading size="lg" color={colors.rosa}>Perfil</Heading>
            <Button size="md" variant="ghost" borderRadius={20} _text={{ color: colors.rosa, fontSize: 16 }} onPress={clearAsyncStorage}>Sair</Button>
          </HStack>

          {userData ? (
            <VStack space={4}>
              <Box bg={colors.branco} borderRadius={18} p={6} alignItems="center" shadow={2}>
                <Avatar size={120} bg="pink.400" mb={3}>
                  <Heading size="2xl" color="white">{userData.name ? String(userData.name).charAt(0).toUpperCase() : 'U'}</Heading>
                </Avatar>
                <Heading size="md" color={colors.rosa} mb={1}>{userData.name}</Heading>
                <NBText color={colors.preto} fontSize="sm">{userData.email}</NBText>
              </Box>

              {/* Grid em duplas para informações */}
              <VStack space={3}>
                <HStack space={3}>
                  <Box flex={1} bg={colors.branco} p={4} borderRadius={14} shadow={1}>
                    <HStack alignItems="center" mb={2}>
                      <FontAwesome name="id-card" size={18} color={colors.rosa} style={{ marginRight: 8 }} />
                      <NBText fontWeight="bold" color={colors.rosa}>Dados</NBText>
                    </HStack>
                    <VStack space={1} pl={1}>
                      <NBText color={colors.preto} fontSize="sm">CPF</NBText>
                      <NBText color={colors.rosa} fontSize="sm" fontWeight="bold">{userData.cpf}</NBText>
                    </VStack>
                  </Box>

                  <Box flex={1} bg={colors.branco} p={4} borderRadius={14} shadow={1}>
                    <HStack alignItems="center" mb={2}>
                      <FontAwesome name="calendar" size={18} color={colors.rosa} style={{ marginRight: 8 }} />
                      <NBText fontWeight="bold" color={colors.rosa}>Nascimento</NBText>
                    </HStack>
                    <NBText color={colors.rosa} fontWeight="bold">{userData.nascimento}</NBText>
                  </Box>
                </HStack>

                <HStack space={3}>
                  <Box flex={1} bg={colors.branco} p={4} borderRadius={14} shadow={1}>
                    <HStack alignItems="center" mb={2}>
                      <FontAwesome name="phone" size={18} color={colors.rosa} style={{ marginRight: 8 }} />
                      <NBText fontWeight="bold" color={colors.rosa}>Contato</NBText>
                    </HStack>
                    <NBText color={colors.rosa} fontWeight="bold">{userData.telefone}</NBText>
                    <NBText color={colors.preto} fontSize="xs">{userData.email}</NBText>
                  </Box>

                  <Box flex={1} bg={colors.branco} p={4} borderRadius={14} shadow={1}>
                    <HStack alignItems="center" mb={2}>
                      <FontAwesome name="map-marker" size={18} color={colors.rosa} style={{ marginRight: 8 }} />
                      <NBText fontWeight="bold" color={colors.rosa}>Endereço</NBText>
                    </HStack>
                    <NBText color={colors.rosa} fontWeight="bold">{userData.endereco}</NBText>
                    <NBText color={colors.preto} fontSize="xs">CEP: {userData.cep}</NBText>
                  </Box>
                </HStack>

                <HStack space={3}>
                  <Box flex={1} bg={colors.branco} p={4} borderRadius={14} shadow={1}>
                    <HStack alignItems="center" mb={2}>
                      <FontAwesome name="user" size={18} color={colors.rosa} style={{ marginRight: 8 }} />
                      <NBText fontWeight="bold" color={colors.rosa}>Conta</NBText>
                    </HStack>
                    <NBText color={colors.rosa} fontWeight="bold">{userData.username}</NBText>
                  </Box>

                  <Box flex={1} bg={colors.branco} p={4} borderRadius={14} shadow={1} justifyContent="center" alignItems="center">
                    <NBText color={colors.preto} fontSize="sm">Ações</NBText>
                    <VStack mt={2} space={2} width="100%">
                      <Button onPress={handleChangePassword} bg={colors.rosa} borderRadius={20} _text={{ fontWeight: 'bold' }}>Alterar senha</Button>
                      <Button onPress={handleDeleteAccount} bg={colors.rosa} borderRadius={20} _text={{ color: colors.branco, fontWeight: 'bold' }} leftIcon={<FontAwesome name="trash" size={14} color={colors.rosa} />}>Excluir conta</Button>
                    </VStack>
                  </Box>
                </HStack>
              </VStack>
            </VStack>
          ) : (
            <NBText color={colors.preto} fontSize="md" textAlign="center" mt={10}>Nenhum dado de usuário encontrado.</NBText>
          )}
        </Box>
      </ScrollView>
    );
  };
  // Função para formatar CPF
  function formatCpf(value: string) {
    const onlyNums = value.replace(/\D/g, "");
    let formatted = onlyNums;
    if (formatted.length > 3) formatted = formatted.slice(0, 3) + '.' + formatted.slice(3);
    if (formatted.length > 7) formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
    if (formatted.length > 11) formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
    return formatted.slice(0, 14);
  }

  // Função para formatar CEP
  function formatCep(value: string) {
    const onlyNums = value.replace(/\D/g, "");
    let formatted = onlyNums;
    if (formatted.length > 5) formatted = formatted.slice(0, 5) + '-' + formatted.slice(5);
    return formatted.slice(0, 9);
  }

  // Validação de nome (não vazio, ao menos 2 caracteres e sem números)
  function isValidName(value: string) {
    if (!value) return false;
    const trimmed = value.trim();
    if (trimmed.length < 2) return false;
    if (/\d/.test(trimmed)) return false; // não pode conter números
    return true;
  }

  // Validação de CEP (formato 00000-000)
  function isValidCep(value: string) {
    const nums = value.replace(/\D/g, '');
    return nums.length === 8;
  }
  // Função para formatar data de nascimento
  function formatNascimento(value: string) {
    const onlyNums = value.replace(/\D/g, "");
    let formatted = onlyNums;
    if (formatted.length > 2) formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
    if (formatted.length > 5) formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
    return formatted.slice(0, 10);
  }
  // Função para formatar telefone
  function formatTelefone(value: string) {
    const onlyNums = value.replace(/\D/g, "");
    let formatted = onlyNums;
    if (formatted.length > 2) formatted = '(' + formatted.slice(0, 2) + ') ' + formatted.slice(2);
    return formatted.slice(0, 15);
  }

  // Validações: email, CPF e telefone
  function isValidEmail(value: string) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  }

  function isValidCpf(value: string) {
    const cpfNums = value.replace(/\D/g, '');
    if (cpfNums.length !== 11) return false;
    // Elimina CPFs inválidos conhecidos
    if (/^(\d)\1+$/.test(cpfNums)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpfNums.charAt(i)) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpfNums.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpfNums.charAt(i)) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpfNums.charAt(10))) return false;
    return true;
  }

  function isValidPhone(value: string) {
    const nums = value.replace(/\D/g, '');
    // Considera DDD + número, mínimo 10 dígitos, máximo 11
    return nums.length === 10 || nums.length === 11;
  }
  const [showEncomendas, setShowEncomendas] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Novo estado para o e-mail
  const [name, setName] = useState(''); // Novo estado para o nome
  const [cpf, setCpf] = useState(''); // Novo estado para o CPF
  const [cep, setCep] = useState(''); // Novo estado para o CEP
  const [endereco, setEndereco] = useState(''); // Novo estado para o endereço
  const [telefone, setTelefone] = useState(''); // Novo estado para telefone/celular
  const [nascimento, setNascimento] = useState(''); // Novo estado para data de nascimento
  const [isRegistering, setIsRegistering] = useState(false); // Novo estado para controle de registro
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
  const [keepLogged, setKeepLogged] = useState(false); // Novo estado para manter logado
  // Estado para aba ativa
  const [activeTab, setActiveTab] = useState<'home' | 'encomenda' | 'perfil' | 'carrinho'>('home');
  // Estado para dados do usuário logado
  const [userData, setUserData] = useState<any | null>(null);

  const handleRegister = () => {
    // Valida campos obrigatórios
    if (!email || !name || !cpf || !cep || !endereco || !telefone || !nascimento || !username || !password) {
      alert('Preencha todos os campos!');
      return;
    }

    // Valida email
    if (!isValidEmail(email)) {
      alert('E-mail inválido!');
      return;
    }

    // Valida CPF
    if (!isValidCpf(cpf)) {
      alert('CPF inválido!');
      return;
    }

    // Valida nome
    if (!isValidName(name)) {
      alert('Nome inválido! Insira pelo menos 2 letras e sem números.');
      return;
    }

    // Valida CEP
    if (!isValidCep(cep)) {
      alert('CEP inválido! Utilize o formato 00000-000.');
      return;
    }

    // Valida telefone
    if (!isValidPhone(telefone)) {
      alert('Telefone inválido!');
      return;
    }

    // Prossegue com registro
    if (email && name && cpf && cep && endereco && telefone && nascimento && username && password) {
      AsyncStorage.getItem('users').then((data) => {
        let users = data ? JSON.parse(data) : [];
        if (users.some((u: any) => u.username === username)) {
          alert('Nome de usuário já existe!');
          return;
        }
        const newUser = { email, name, cpf, cep, endereco, telefone, nascimento, username, password };
        users.push(newUser);
        AsyncStorage.setItem('users', JSON.stringify(users)).then(() => {
          setIsLoggedIn(true);
          setLoggedUser(username);
          setUserData(newUser); // Salva dados do usuário logado
          if (keepLogged) {
            AsyncStorage.setItem('loggedUser', username);
          }
          setEmail(''); setName(''); setCpf(''); setCep(''); setEndereco(''); setTelefone(''); setNascimento(''); setUsername(''); setPassword('');
          setIsRegistering(false);
          setActiveTab('home'); // Redireciona para Home
        });
      });
    } else {
      alert('Preencha todos os campos!');
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Preencha usuário e senha!");
      return;
    }
    try {
      const data = await AsyncStorage.getItem('users');
      const users = data ? JSON.parse(data) : [];
      const user = users.find((u: any) => u.username === username && u.password === password);
      if (user) {
        setIsLoggedIn(true);
        setLoggedUser(user.username);
        setUserData(user); // Salva dados do usuário logado
        await AsyncStorage.setItem('loggedUser', user.username);
        setActiveTab('home'); // Redireciona para Home
        console.log("Login bem-sucedido!");
      } else {
        alert("Usuário ou senha incorretos!");
      }
    } catch (error: any) {
      console.log("Erro ao realizar login:", error);
    }
  };

  const clearAsyncStorage = async () => {
  await AsyncStorage.removeItem('loggedUser');
  setIsLoggedIn(false);
  setLoggedUser(null);
  setUserData(null); // Limpa dados do usuário logado
  setUsername('');
  setPassword('');
  console.log('Logout realizado.');
  };

  const switchToRegister = () => {
    setEmail('');
    setName('');
    setCpf('');
    setUsername('');
    setPassword('');
    setIsRegistering(true);
  };

  const handleClearUsers = async () => {
    await AsyncStorage.removeItem('users');
    alert('Todos os registros foram apagados!');
  };

  // Estado para modal de senha de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Função para abrir modal de exclusão
  const handleDeleteAccount = () => {
    setDeletePassword('');
    setShowDeleteModal(true);
  };

  // Função para confirmar exclusão
  const confirmDeleteAccount = async () => {
  if (!deletePassword) {
    Alert.alert('Erro', 'Digite sua senha!');
    return;
  }

  const data = await AsyncStorage.getItem('users');
  let users = data ? JSON.parse(data) : [];
  const user = users.find((u: any) => u.username === loggedUser);

  if (!user) {
    Alert.alert('Erro', 'Usuário não encontrado!');
    return;
  }

  if (user.password !== deletePassword) {
    Alert.alert('Erro', 'Senha incorreta!');
    return;
  }

  // Remove usuário do AsyncStorage
  const filtered = users.filter((u: any) => u.username !== loggedUser);
  await AsyncStorage.setItem('users', JSON.stringify(filtered));

  // Limpa sessão
  await clearAsyncStorage();
  setShowDeleteModal(false);
  Alert.alert('Sucesso', 'Conta excluída!');
};
// Função para alterar senha
const [showChangeModal, setShowChangeModal] = useState(false);
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');

const handleChangePassword = () => {
  setCurrentPassword('');
  setNewPassword('');
  setShowChangeModal(true);
};

const confirmChangePassword = async () => {
  if (!currentPassword || !newPassword) {
    alert('Preencha os dois campos!');
    return;
  }
  const data = await AsyncStorage.getItem('users');
  let users = data ? JSON.parse(data) : [];
  const idx = users.findIndex((u: any) => u.username === loggedUser);
  if (idx === -1 || users[idx].password !== currentPassword) {
    alert('Senha atual incorreta!');
    return;
  }
  users[idx].password = newPassword;
  await AsyncStorage.setItem('users', JSON.stringify(users));
  setUserData(users[idx]);
  setShowChangeModal(false);
  alert('Senha alterada com sucesso!');
};

  if (isRegistering) {
    // Se acabou de registrar, redireciona para Home
    if (isLoggedIn) {
      setIsRegistering(false);
      setActiveTab('home');
      return null;
    }
    return (
      <NativeBaseProvider>
        <ScrollView style={{ flex: 1, backgroundColor: '#fff6fa' }} contentContainerStyle={{ padding: 24, paddingBottom: 120, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.rosa, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Registrar</Text>
        <View style={{ width: '100%' }}>
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="E-mail" placeholderTextColor="#b3afaf" value={email} onChangeText={setEmail} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Nome" placeholderTextColor="#b3afaf" value={name} onChangeText={setName} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="CPF" placeholderTextColor="#b3afaf" value={cpf} keyboardType="numeric" maxLength={14} onChangeText={text => setCpf(formatCpf(text))} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="CEP" placeholderTextColor="#b3afaf" value={cep} keyboardType="numeric" maxLength={9} onChangeText={text => setCep(formatCep(text))} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Endereço" placeholderTextColor="#b3afaf" value={endereco} onChangeText={setEndereco} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Celular/Telefone" placeholderTextColor="#b3afaf" value={telefone} keyboardType="phone-pad" onChangeText={text => setTelefone(formatTelefone(text))} maxLength={15} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Data de nascimento (DD/MM/AAAA)" placeholderTextColor="#b3afaf" value={nascimento} keyboardType="numeric" onChangeText={text => setNascimento(formatNascimento(text))} maxLength={10} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Nome de Usuário" placeholderTextColor="#b3afaf" value={username} onChangeText={setUsername} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Senha" placeholderTextColor="#b3afaf" value={password} onChangeText={setPassword} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 2 }}>
          <TouchableOpacity style={{ marginRight: 8 }} onPress={() => setKeepLogged(prev => !prev)}>
            <View style={{ width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: colors.rosa, backgroundColor: keepLogged ? colors.rosa : colors.branco, justifyContent: 'center', alignItems: 'center' }}>
              {keepLogged && <Feather name="check" size={16} color={colors.branco} />}
            </View>
          </TouchableOpacity>
          <Text style={{ color: colors.preto, fontSize: 17 }}>Manter logado</Text>
        </View>
        <TouchableOpacity style={{ width: '100%', backgroundColor: colors.rosa, borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginBottom: 8, elevation: 2 }} onPress={handleRegister}>
          <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>Registrar</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 20, color: colors.rosa, textDecorationLine: 'underline', fontSize: 16 }} onPress={() => setIsRegistering(false)}>
          Já tem uma conta? Faça login
        </Text>
        </ScrollView>
      </NativeBaseProvider>
    );
  }

  if (!isLoggedIn) {
    return (
      <NativeBaseProvider>
        <View style={{ flex: 1, backgroundColor: '#fff6fa', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
    <View style={{ width: '100%', maxWidth: 400, borderRadius: 32, padding: 28, alignItems: 'center' }}>
           
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.rosa, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Bem-vindo!</Text>
            <View style={{ width: '100%', marginBottom: 12 }}>
              <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.gelo, color: colors.preto, marginBottom: 15 }} placeholder="Usuário" placeholderTextColor="#b3afaf" value={username} onChangeText={setUsername} />
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: colors.rosa, borderRadius: 25, paddingHorizontal: 18, backgroundColor: colors.gelo }}>
                <TextInput style={{ flex: 1, height: 50, fontSize: 17, color: colors.preto }} placeholder="Senha" placeholderTextColor="#b3afaf" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={24} color={colors.rosa} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={{ width: '100%', backgroundColor: colors.rosa, borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginBottom: 8, shadowColor: colors.rosa, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 4 }} onPress={handleLogin}>
              <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '100%', backgroundColor: colors.rosa, borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginTop: 10, marginBottom: 8, shadowColor: colors.rosa, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 4 }} onPress={switchToRegister}>
              <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '100%', backgroundColor: colors.preto, borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginTop: 10, marginBottom: 8, shadowColor: colors.preto, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 4 }} onPress={handleClearUsers}>
              <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>Apagar registros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <View style={{ flex: 1 }}>
      {/* Renderização das páginas SEM desmontar componentes */}
      <View style={{ flex: 1, display: activeTab === 'home' ? 'flex' : 'none' }}>
        <HomePage />
      </View>
      <View style={{ flex: 1, display: activeTab === 'encomenda' ? 'flex' : 'none' }}>
  <EncomendasPage carrinho={carrinho} setCarrinho={setCarrinho} setActiveTab={setActiveTab} />
      </View>
      <View style={{ flex: 1, display: activeTab === 'perfil' ? 'flex' : 'none' }}>
        <PerfilPage clearAsyncStorage={clearAsyncStorage} userData={userData} handleDeleteAccount={handleDeleteAccount} handleChangePassword={handleChangePassword} />
        {/* ...modais de perfil... */}
      </View>
      <View style={{ flex: 1, display: activeTab === 'carrinho' ? 'flex' : 'none' }}>
        <CarrinhoPage />
      </View>
      {/* Rodapé fixo */}
      <View style={styles.ifoodTabBar}>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'home' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('home')}
        >
          <MaterialIcons name="home" size={32} color={activeTab === 'home' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'home' && { color: colors.rosa }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'encomenda' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('encomenda')}
        >
          <MaterialCommunityIcons name="package-variant" size={32} color={activeTab === 'encomenda' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'encomenda' && { color: colors.rosa }]}>Encomenda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'carrinho' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('carrinho')}
        >
          <MaterialIcons name="shopping-cart" size={30} color={activeTab === 'carrinho' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'carrinho' && { color: colors.rosa }]}>Carrinho</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'perfil' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('perfil')}
        >
          <FontAwesome name="user" size={30} color={activeTab === 'perfil' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'perfil' && { color: colors.rosa }]}>Perfil</Text>
        </TouchableOpacity>
      </View>
      </View>
    </NativeBaseProvider>
  );
}
import Encomendas from './Encomendas';
//estilos globais
const styles = StyleSheet.create({
  carrinhoBadge: {
    position: 'absolute',
    top: 55,
    right: -6,
    backgroundColor: colors.rosa,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.branco,
  },
  carrinhoBadgeText: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 14,
  },
  carrinhoContainer: {
    backgroundColor: colors.gelo,
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    marginBottom: 18,
    elevation: 2,
  },
  carrinhoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: colors.branco,
    borderRadius: 12,
    padding: 8,
    elevation: 1,
  },
  carrinhoImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: 'cover',
  },
 
  //estilo da barra de navegação inferior
  ifoodTabBar: {
    flexDirection: 'row',//alinha os itens em uma linha
    justifyContent: 'space-evenly',//espaço igual entre todos os botões
    alignItems: 'center',//alinha os itens verticalmente ao centro
    width: '100%',//largura total
    paddingBottom: 24,//espaçamento inferior para área segura
    paddingTop: 6,//espaçamento superior
    backgroundColor: colors.branco,//cor de fundo
    position: 'absolute',//fixa na parte inferior
    left: 0,//alinha a esquerda
    right: 0,//alinha a direita
    bottom: 0,//posiçao inferior
    zIndex: 99,//garante que fique acima de outros elementos  
    shadowColor: '#070707ff',//cor da sombra
    shadowOffset: { width: 0, height: -2 },//posição da sombra
    shadowOpacity: 0.08,//opacidade da sombra
    shadowRadius: 8,//raio da sombra
    elevation: 8,//elevação para sombra no Android
  },
  //estilo de cada botão da barra de navegação
  ifoodTabButton: {
    flex: 1,//ocupa espaço igual
    height: 80,//altura do botão
    marginHorizontal: 8,//espaçamento horizontal entre os botões
    borderRadius: 24,//bordas arredondadas
    backgroundColor: colors.branco,//cor de fundo
    justifyContent: 'center',//centraliza o conteúdo verticalmente
    alignItems: 'center',//centraliza o conteúdo horizontalmente
    flexDirection: 'column',//alinha o ícone e o texto em coluna
  },
  //estilo do botão ativo
  ifoodTabButtonActive: {
    backgroundColor: '#fff0f6',//cor de fundo do botão ativo
    borderWidth: 1,//largura da borda
    borderColor: colors.rosa,//cor da borda
  },
  //estilo do texto dos botões
  ifoodTabButtonText: {
    fontSize: 14,//tamanho da fonte
    fontWeight: 'bold',//negrito
    marginTop: 2,//espaçamento entre o ícone e o texto
    color: colors.preto,//cor do texto
  },
 
});