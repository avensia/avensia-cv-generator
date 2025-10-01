import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface PropsType {
  children: React.ReactNode;
  title?: string;
  hr?: boolean;
  wrap?: boolean;
}

const style = StyleSheet.create({
  hr: {
    paddingTop: 16,
    borderTop: '1px solid #ccc',
  },
  section: {
    marginTop: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

const Section = ({ children, title, hr, wrap }: PropsType) => {
  return (
    <View style={style.section} wrap={wrap}>
      {!!hr && <View style={style.hr} />}
      {!!title && <Text style={style.title}>{title}</Text>}
      <View>{children}</View>
    </View>
  );
};

export default Section;
