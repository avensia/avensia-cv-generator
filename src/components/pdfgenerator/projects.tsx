import { View, Text, StyleSheet } from '@react-pdf/renderer';

const style = StyleSheet.create({
  maincontainer: { marginBottom: 10 },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  roleTenureContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  position: {
    fontSize: 12,
    fontWeight: 600,
    marginRight: 8,
  },
  tenureship: {
    fontWeight: 500,
    fontSize: 10,
  },
  description: { marginTop: 8 },
});

const Projects = ({ projects }: CVFormProjectsData) => (
  <View>
    {projects &&
      projects.length > 0 &&
      projects.map((proj, idx) => (
        <View key={`${idx} - ${proj.title}`} style={style.maincontainer}>
          <View style={style.topContainer}>
            <Text style={style.title}>{proj.title}</Text>
            <View style={style.roleTenureContainer}>
              {proj.role && <Text style={style.position}>{proj.role}</Text>}
              {proj.date && <Text style={style.tenureship}>{proj.date}</Text>}
            </View>
          </View>
          <Text style={style.description}>{proj.projectDetails}</Text>
        </View>
      ))}
  </View>
);

export default Projects;
