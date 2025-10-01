import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  list: { marginTop: 4 },
  li: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  bullet: {
    width: 10, // fixed width keeps the indent
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 1.2,
  },
  itemText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 1.4, // nice readability
  },
});

export const BulletItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.li}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.itemText}>{children}</Text>
  </View>
);

const Skills = ({ skills }: { skills?: string[] }) => {
  // const items = ['Javascript', 'Typescript', 'React', '.NET', 'Java', 'Action script 2/3'];

  return (
    <View style={styles.list}>
      {skills?.map((t: string, i: number) => (
        <BulletItem key={i}>{t}</BulletItem>
      ))}
    </View>
  );
};

export default Skills;
