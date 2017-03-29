import {
  Mongo
} from 'meteor/mongo';

const Projects = new Mongo.Collection('projects'); 
export default Projects;