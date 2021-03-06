import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Button } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {},
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>Get started</Button>
);

export const Default = Template.bind({});
