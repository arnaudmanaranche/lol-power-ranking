import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Title } from "./Title";

export default {
  title: "Components/Title",
  component: Title,
  argTypes: {},
} as ComponentMeta<typeof Title>;

const Template: ComponentStory<typeof Title> = (args) => (
  <Title {...args}>Hello world</Title>
);

export const Default = Template.bind({});
Default.args = {
  tag: "h1",
};
