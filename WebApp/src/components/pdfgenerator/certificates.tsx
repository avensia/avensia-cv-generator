import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import { BulletItem } from './skills';

const styles = StyleSheet.create({
  list: { marginTop: 4 },
});

const Certificates = () => {
  const items = ['Commercetools', 'Optimizely'];

  return (
    <View style={styles.list}>
      {items.map((t, i) => (
        <BulletItem key={i}>{t}</BulletItem>
      ))}
    </View>
  );
};

export default Certificates;
