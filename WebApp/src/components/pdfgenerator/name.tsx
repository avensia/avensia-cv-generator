import { View, Text, StyleSheet, Link } from '@react-pdf/renderer';

const style = StyleSheet.create({
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
  },
  addDetails: {
    fontSize: 11,
    marginTop: 10,
  },
});

const Name = ({ formData }: CVFormData) => {
  return (
    <View wrap={false}>
      <Text style={style.name}>{formData?.fullName}</Text>
      <Text style={style.role}>{formData?.position}</Text>
      <View>
        <Text style={style.addDetails}>
          <Link>{formData?.email}</Link>
        </Text>
        <Text style={style.addDetails}>{formData?.phone}</Text>
        <Text style={style.addDetails}>
          <Link src="#">{formData?.linkedIn}</Link>
        </Text>
      </View>
    </View>
  );
};

export default Name;
