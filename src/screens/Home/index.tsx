import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Platform } from 'react-native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';

import { revenuecatAPIKeys } from '~/constants/revenuecat_api_key';

import { BookCard } from '~/components/BookCard';
import { Loading } from '~/components/Loading';
import { IBook } from '~/interfaces';

export function Home() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);

  const setup = async () => {
    if (Platform.OS == "android") {
      await Purchases.configure({ apiKey: revenuecatAPIKeys.google });
    } else {
      await Purchases.configure({ apiKey: revenuecatAPIKeys.apple });
    }
    
    const offerings = await Purchases.getOfferings();
    setCurrentOffering(offerings.current);
  };

  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG)

    setup()
    .catch(console.log);
  }, []);

  console.debug({ currentOffering })

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookCard book={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#000814',
  },
});
